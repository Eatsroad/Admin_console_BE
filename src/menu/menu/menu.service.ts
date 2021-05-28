import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { Menu } from 'src/entities/menu/menu.entity';
import { Repository } from 'typeorm';
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

       async updateCategory(menuId: number,categoryId: number): Promise<MenuInfoResponseDto>{
        const menu = this.getMenuInfo(menuId);
        (await menu).category_id= categoryId;
        return menu;
      }

      async updateOptionGroup(menuId: number, optionId : number ): Promise<MenuInfoResponseDto> {
        const menu = this.getMenuInfo(menuId);
        (await menu).option_group_id = optionId;
        return menu;
      }
      async updateEventGroup(menuId: number, eventId : number) : Promise<MenuInfoResponseDto> {
        const menu = this.getMenuInfo(menuId);
        (await menu).event_group_id = eventId;
        return menu;
      }

}
