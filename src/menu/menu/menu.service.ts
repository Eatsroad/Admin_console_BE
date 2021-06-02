import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { Menu } from 'src/entities/menu/menu.entity';
import { createConnection, Repository } from 'typeorm';
import { resourceLimits } from 'worker_threads';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuInfoResponseDto } from './dtos/menu-info.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
//MenuInfoResponseDto
@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>
    ) {}

    private menuCreateDtoToEntity = (dto: MenuCreateDto): Menu => {
        const menu = new Menu();
        menu.setName = dto.name;
        menu.setMenu_id = dto.menu_id;
        menu.setPrice = dto.price;
        menu.setDesc = dto.desc;
        menu.setState = dto.state;
        menu.setCategory_id=dto.category_id;
        menu.setEvent_group_id=dto.event_group_id;
        menu.setOption_group_id=dto.option_group_id;
        return menu;
      }
    
      async saveMenu(dto: MenuCreateDto): Promise<MenuInfoResponseDto> {
         const menu = await this.menuRepository.save(
            this.menuCreateDtoToEntity(dto)
          );
          return new MenuInfoResponseDto(menu);
        
      }
    
      async getMenuInfo(menuId: number): Promise<MenuInfoResponseDto> {
        const menu = await this.menuRepository.findOne(menuId);
        if (!!menu) {
          return new MenuInfoResponseDto(menu);
        } else {
          throw new NotFoundException();
        }
      }
      
      async updateMenuInfo(
        menuId: number,
        dto: MenuUpdateDto
      ): Promise<BasicMessageDto> {
        const result = await this.menuRepository
          .createQueryBuilder()
          .update("menus", { ...dto })//update해라
          .where("menu_id = :menuId", { menuId })//menuId=menuId인 위치에서
          .execute();
        if (result.affected !== 0) {
          return new BasicMessageDto("Updated Successfully.");
        } else throw new NotFoundException();
      }
      
      async removeMenu(menuId: number): Promise<BasicMessageDto> {
        const result = await this.menuRepository.delete(menuId);
        if (result.affected !== 0) {
          return new BasicMessageDto("Deleted Successfully.");
        } else throw new NotFoundException();
      }
  
       async updateCategory(menuId: number,
        dto: MenuUpdateDto, categoryId:number//update할 카테고리id
      ): Promise<BasicMessageDto> {
        const result = await this.menuRepository
          .createQueryBuilder()
          .update("menus", { ...dto })//update해라
          .set({category_id: categoryId})
          .where("menu_id = :menuId", { menuId })//menuId=menuId인 위치에서
          .execute();
        if (result.affected !== 0) {
          return new BasicMessageDto("(Category) Updated Successfully.");
        } else throw new NotFoundException();
       
      }

      async updateOptionGroup(menuId: number,
        dto: MenuUpdateDto, optiongroupId:number//update할 카테고리id
      ): Promise<BasicMessageDto> {
        const result = await this.menuRepository
          .createQueryBuilder()
          .update("menus", { ...dto })//update해라
          .set({option_group_id: optiongroupId})
          .where("menu_id = :menuId", { menuId })//menuId=menuId인 위치에서
          .execute();
        if (result.affected !== 0) {
          return new BasicMessageDto("(OptionGroup) Updated Successfully.");
        } else throw new NotFoundException();
       
      }
      async updateEventGroup(menuId: number,
        dto: MenuUpdateDto, eventgroupId:number//update할 카테고리id
      ): Promise<BasicMessageDto> {
        const result = await this.menuRepository
          .createQueryBuilder()
          .update("menus", { ...dto })//update해라 menus=table명
          .set({event_group_id: eventgroupId})
          .where("menu_id = :menuId", { menuId })//menuId=menuId인 위치에서
          .execute();
        if (result.affected !== 0) {
          return new BasicMessageDto("(EventGroup) Updated Successfully.");
        } else throw new NotFoundException();
      }
  //categoryid를삭제해서 null로 만든다. or 1.<<softdelete공부해서 이용>>
    async removeCategory(dto:MenuUpdateDto, menuId:number): Promise<BasicMessageDto> {
      const result = await this.menuRepository
      .createQueryBuilder()
      .update("menus", { ...dto })
      .set({category_id: null})
      .where("menu_id = :menuId", { menuId })
      .execute();
      if (result.affected !== 0) {
       return new BasicMessageDto("(Category) Deleted Successfully.");
      } else throw new NotFoundException();
    }
 
    async removeOptionGroup(dto:MenuUpdateDto, menuId:number): Promise<BasicMessageDto> {
      const result = await this.menuRepository
      .createQueryBuilder()
      .update("menus", { ...dto })
      .set({option_group_id: null})
      .where("menu_id = :menuId", { menuId })
      .execute();
      if (result.affected !== 0) {
       return new BasicMessageDto("(Category) Deleted Successfully.");
      } else throw new NotFoundException();
    }
   async removeEventGroup(dto:MenuUpdateDto, menuId:number): Promise<BasicMessageDto> {
    const result = await this.menuRepository
    .createQueryBuilder()
    .update("menus", { ...dto })
    .set({event_group_id: null})
    .where("menu_id = :menuId", { menuId })
    .execute();
    if (result.affected !== 0) {
     return new BasicMessageDto("(Category) Deleted Successfully.");
    } else throw new NotFoundException();
  }
//2.작동되는지 확인하기 3.createconnection에 대해서 알아보기
  // async removeEventgroup2(dto:MenuUpdateDto, menuId:number) /*Promise<BasicMessageDto>*/{
  //   createConnection().then(async connection => {
  //     await connection
  //     .getRepository(Menu)
  //     .createQueryBuilder()
  //     .softDelete()
  //   }).catch(error => console.log(error));
    
  // }
  
  
}
