import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { Category } from 'src/entities/category/category.entity';
import { Menu } from 'src/entities/menu/menu.entity';
import { OptionGroup } from 'src/entities/option/optionGroup.entity';
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
        menu.setMenuId = dto.menu_id;
        //menu.setStoreId = dto.store_id;
        menu.setMenuName = dto.name;
        menu.setMenuPrice = dto.price;
        menu.setMenuDesc = dto.description;
        menu.setMenuState = dto.state;
        // menu.setCategories = dto.categories;
        // menu.setOptionGroups = dto.optionGroups;
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
          .update("menus", { ...dto })
          .where("menu_id = :menuId", { menuId })
          .execute();
        if (result.affected !== 0) {
          return new BasicMessageDto("Updated Successfully.");
        } else throw new NotFoundException();
      }
  
      //  async updateCategory(menuId: number,
      //   dto: MenuUpdateDto, categoryId:Category[]
      // ): Promise<BasicMessageDto> {
      //   const result = await this.menuRepository
      //     .createQueryBuilder()
      //     .update("menus", { ...dto })
      //     .set({categories: categoryId})
      //     .where("menu_id = :menuId", { menuId })
      //     .execute();
      //   if (result.affected !== 0) {
      //     return new BasicMessageDto("(Category) Updated Successfully.");
      //   } else throw new NotFoundException();
       
      // }

      // async updateOptionGroup(menuId: number,
      //    dto: MenuUpdateDto, optiongroupId:OptionGroup[]
      //   ): Promise<BasicMessageDto> {
      //    const result = await this.menuRepository
      //      .createQueryBuilder()
      //      .update("menus", { ...dto })
      //      .set({optionGroups: optiongroupId})
      //      .where("menu_id = :menuId", { menuId })
      //      .execute();
      //    if (result.affected !== 0) {
      //      return new BasicMessageDto("(OptionGroup) Updated Successfully.");
      //    } else throw new NotFoundException();
       
      // }
      

      async removeMenu(menuId: number): Promise<BasicMessageDto> {
        const result = await this.menuRepository.delete(menuId);
        if (result.affected !== 0) {
          return new BasicMessageDto("Deleted Successfully.");
        } else throw new NotFoundException();
      }
  
    // async removeCategory(dto:MenuUpdateDto, menuId:number): Promise<BasicMessageDto> {
    //   const result = await this.menuRepository
    //   .createQueryBuilder()
    //   .update("menus", { ...dto })
    //   .set({categories: null})
    //   .where("menu_id = :menuId", { menuId })
    //   .execute();
    //   if (result.affected !== 0) {
    //    return new BasicMessageDto("(Category) Deleted Successfully.");
    //   } else throw new NotFoundException();
    // }
 
    //  async removeOptionGroup(dto:MenuUpdateDto, menuId:number): Promise<BasicMessageDto> {
    //    const result = await this.menuRepository
    //    .createQueryBuilder()
    //    .update("menus", { ...dto })
    //    .set({optionGroups: null})
    //    .where("menu_id = :menuId", { menuId })
    //    .execute();
    //    if (result.affected !== 0) {
    //     return new BasicMessageDto("(Category) Deleted Successfully.");
    //    } else throw new NotFoundException();
    //  }

  

  
  
  
}
