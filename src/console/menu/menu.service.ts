import { ConflictException, Injectable, Next, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { Menu } from '../../../src/entities/menu/menu.entity';
import { Any, getRepository, Not, Repository } from 'typeorm';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuInfoResponseDto } from './dtos/menu-info.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
import { OptionGroup } from '../../../src/entities/option/optionGroup.entity';
import { Category } from '../../../src/entities/category/category.entity';
import { Store } from '../../../src/entities/store/store.entity';
import { EnableTime } from '../../../src/entities/menu/enableTime.entity';


@Injectable()
export class MenuService {
    constructor(
<<<<<<< HEAD
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    ) {}

=======
      @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    ) {}
>>>>>>> 126f3dabbf6d8c8ef56acca10283db5919a4d1bd
    private convert2StoreObj = async (store_id:number): Promise<Store> => {
      const store = getRepository(Store);
      return await store.findOne(store_id); 
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

    private menuCreateDtoToEntity = async (dto: MenuCreateDto): Promise<Menu> => {
        const menu = new Menu();
        menu.setMenuName = dto.name;
        menu.setMenuPrice = dto.price;
        menu.setMenuDesc = dto.description;
        menu.setMenuState = dto.state;
        menu.store_id = await this.convert2StoreObj(dto.store_id);
        return menu;
    }

    private MenuExist = async (name:string, store_id:number):Promise<boolean> => {
      return (
        (await this.menuRepository
          .createQueryBuilder()
          .select("m.menu_id")
          .from(Menu, "m")
          .where("m.name = :name",{name})
          .andWhere("m.store_id = :store_id",{ store_id })
          .getOne()) !== undefined
      );
    };

  async saveMenu(dto: MenuCreateDto): Promise<MenuInfoResponseDto> {
    if( await this.MenuExist(dto.name, dto.store_id)) {
      throw new ConflictException("Menu is already in use!");
    } else {
      const menu = await this.menuRepository.save(
        await this.menuCreateDtoToEntity(dto)
      );
      return new MenuInfoResponseDto(menu);
    }
  }
    
  async getMenuInfo(menuId: number): Promise<MenuInfoResponseDto> {
    const menu = await this.menuRepository.findOne(menuId, {relations:["store_id","categories","optionGroups","enable_time"]});
    if (!!menu) {
      return new MenuInfoResponseDto(menu);
    } else {
      throw new NotFoundException();
    }
  }

  async getMenuList(storeId: number): Promise<MenuInfoResponseDto[]>{
    const result = await this.menuRepository.find({
      where :{
        store_id: storeId,
      },
      relations:['store_id','categories','optionGroups'],
    });
    // const result = await this.menuRepository.createQueryBuilder()
    // .select("menus")
    // .from(Menu,"menus")
    // .where("menus.store_id =:storeId",{ storeId })
    // .getMany();
    console.log(result);
    return result.map((result) => new MenuInfoResponseDto(result));
  }

  async updateMenuInfo(
    menuId: number,
    dto: MenuUpdateDto
  ): Promise<BasicMessageDto> {
    if(await this.MenuExist(dto.name, dto.store_id)){
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
  }
    
  async updateStoreIdInMenu (
    menuId: number,
    dto: MenuUpdateDto
  ) : Promise<BasicMessageDto>{
    const menu = await this.menuRepository.findOne(menuId);
    menu.store_id = await this.convert2StoreObj(dto.store_id);
    
    await this.menuRepository.save(menu);
    return new BasicMessageDto("StoreId is Updated Successfully")
  }

  async updateCategoryInMenu(menuId : number,
    dto: MenuUpdateDto
    ): Promise<BasicMessageDto> {
      const menu = await this.menuRepository.findOne(menuId);
      menu.categories = await this.convert2CategoryObj(dto.categories);

      const result = await this.menuRepository.save(menu);
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

  async removeCategoryInMenu(menuId: number): Promise<BasicMessageDto> {
      const menu = await this.menuRepository.findOne(menuId);
      menu.categories = null;
      const result = await this.menuRepository.save(menu);
      if (result.categories == null){
      return new BasicMessageDto("Category Deleted successfully!");
      } else throw new NotFoundException();
    }

  async removeOptionGroupInMenu(menuId: number): Promise<BasicMessageDto> {
    const menu = await this.menuRepository.findOne(menuId);
    menu.optionGroups = null;
    const result = await this.menuRepository.save(menu);
    if(result.optionGroups == null){
    return new BasicMessageDto("OptionGroup Deleted Successfully.");
<<<<<<< HEAD
    } else throw new NotFoundException();
=======
>>>>>>> 126f3dabbf6d8c8ef56acca10283db5919a4d1bd
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


