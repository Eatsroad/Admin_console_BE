import { ConflictException, Injectable, Logger, NotFoundException, Req, Res, UseInterceptors } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { Menu } from '../../../src/entities/menu/menu.entity';
import { Connection, getRepository, QueryRunner, Repository, Transaction, TransactionRepository } from 'typeorm';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuInfoResponseDto } from './dtos/menu-info.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
import { OptionGroup } from '../../../src/entities/option/optionGroup.entity';
import { Category } from '../../../src/entities/category/category.entity';
import { Store } from '../../../src/entities/store/store.entity';
import { EnableTime } from '../../../src/entities/menu/enableTime.entity';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as dotenv from 'dotenv';
dotenv.config();
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId:process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class MenuService {
    constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    
    ) {}

    private convert2StoreObj = async (store_id:string): Promise<Store> => {
      const RealStoreId = Number(Buffer.from(store_id, "base64").toString("binary"));
      const store = getRepository(Store);
      return await store.findOne(RealStoreId); 
    }

    private convert2CategoryObj = async (category:number[]) : Promise<Category[]> => {
      const categories = getRepository(Category);
      return await categories.findByIds(category);
    }

    private convert2OptionGroupObj = async (optionGroup:number[]) : Promise<OptionGroup[]> => {
      const optiongroups = getRepository(OptionGroup);
      return await optiongroups.findByIds(optionGroup);
    }

    private convert2EnableTimeObj = async (Enabletime : number) : Promise<EnableTime> => {
      const enableTime = getRepository(EnableTime);
      return await enableTime.findOne(Enabletime);
    }

    private menuCreateDtoToEntity = async (dto: MenuCreateDto, storeId: string): Promise<Menu> => {
        const menu = new Menu();
        menu.setMenuName = dto.name;
        menu.setMenuPrice = dto.price;
        menu.setMenuDesc = dto.description;
        menu.setMenuState = dto.state;
        menu.store_id = await this.convert2StoreObj(storeId);
        return menu;
    }

    private MenuExist = async (name: string, store_id: string): Promise<boolean> => {
      const RealStoreId = Number(Buffer.from(store_id, "base64").toString("binary"));
      return (
        (await this.menuRepository
          .createQueryBuilder()
          .select("m.menu_id")
          .from(Menu, "m")
          .where("m.name = :name",{ name })
          .andWhere("m.store_id = :RealStoreId",{ RealStoreId })
          .getOne()) !== undefined
      );
    };

    private StoreExist = async (storeId:number) : Promise<Boolean> => {
      return (
        (await this.menuRepository
        .createQueryBuilder()
        .select("m.name")
        .from(Menu,"m")
        .where("m.store_id =:storeId", { storeId })
        .getOne()) !== undefined
      )
    };

    async fileUpload(file : Express.Multer.File){
      
      
    }


   
  async saveMenu(dto: MenuCreateDto, storeId: string): Promise<MenuInfoResponseDto> {
      try{
        if (await this.MenuExist(dto.name, storeId)) {
        throw new ConflictException("Menu is already in use!");
      } else {
        const menu = await this.menuRepository.save(
          await this.menuCreateDtoToEntity(dto, storeId)
        );
        return new MenuInfoResponseDto(menu);
      } 
      } catch(e){
        return e;
      } 
  }
    
  async getMenuInfo(menuId: number): Promise<MenuInfoResponseDto> {    
    const menu = await this.menuRepository.findOne(menuId,{relations:["store_id","categories","optionGroups","enable_time"]});
    if (!!menu) {
      return new MenuInfoResponseDto(menu);
    } else {
      throw new NotFoundException();
    }
  
  }

  async getMenuList (storeId: string): Promise<MenuInfoResponseDto[]> {
    
    const RealStoreId = Number(Buffer.from(storeId, "base64").toString("binary"));
    
      if(await this.StoreExist(RealStoreId)){
      const result = await this.menuRepository.find({
        where :{
          store_id: RealStoreId,
        },
        relations:['store_id','categories','optionGroups'],
      });
      return await result.map((result) => new MenuInfoResponseDto(result));
    }
     else throw new NotFoundException(); 
   
  }

  async updateMenuInfo(
    menuId: number,
    dto: MenuUpdateDto,
    storeId: string
  ): Promise<BasicMessageDto> {
  try{
      if(await this.MenuExist(dto.name, storeId)){
        throw new ConflictException("Menu is already in use!");
      } else {
      const result = await this.menuRepository
      .createQueryBuilder()
      .update( "menus", { ...dto })
      .where("menu_id = :menuId", { menuId })
      .execute();

      if(result.affected !== 0) {
        return new BasicMessageDto("Updated Successfully.");
      } else throw new NotFoundException();
    }
  }catch(e){
    return e;
  }
    
    
  }

  async updateCategoryInMenu(menuId : number,
    dto: MenuUpdateDto
    ): Promise<BasicMessageDto> {
        const menu = await this.menuRepository.findOne(menuId);
        menu.categories = await this.convert2CategoryObj(dto.categories);
        await this.menuRepository.save(menu);
        return new BasicMessageDto("Category Updated successfully!");
      
    }

  async updateOptionGroupInMenu(menuId: number,
    dto: MenuUpdateDto
   ): Promise<BasicMessageDto> {
    const menu = await this.menuRepository.findOne(menuId);
    menu.optionGroups = await this.convert2OptionGroupObj(dto.optionGroups);
    await this.menuRepository.save(menu);
    return new BasicMessageDto("OptionGroup Updated Successfully.");
 }

  async updateEnableTimeInMenu(menuId: number,
    dto: MenuUpdateDto
  ): Promise<BasicMessageDto> {
    const menu = await this.menuRepository.findOne(menuId);
    menu.enable_time = await this.convert2EnableTimeObj(dto.enable_time);
    await this.menuRepository.save(menu);
    return new BasicMessageDto("EnableTime Updated Successfully.");
  }

  async removeMenu(menuId : number): Promise<BasicMessageDto> {
    const result = await this.menuRepository.delete(menuId);
    if (result.affected !== 0) {
      return new BasicMessageDto("Deleted Successfully.");
    } else throw new NotFoundException();
  }

 async removeEnableTimeInMenu(menuId: number,
  ): Promise<BasicMessageDto> {
   const menu = await this.menuRepository.findOne(menuId);
   menu.enable_time = null;

   const result = await this.menuRepository.save(menu);
   if(result.enable_time == null){
   return new BasicMessageDto("EnableTime Deleted Successfully.");
  } else throw new NotFoundException();
}

 
}


