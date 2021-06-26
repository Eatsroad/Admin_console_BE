import { ConflictException, Injectable, Next, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { Menu } from '../../../src/entities/menu/menu.entity';
import { Connection, getRepository, Repository } from 'typeorm';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuInfoResponseDto } from './dtos/menu-info.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
import { NextFunction } from 'express';
import { Store } from 'src/entities/store/store.entity';

@Injectable()
export class MenuService {
    constructor(
      @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
      ) {}

    private menuCreateDtoToEntity = async (dto: MenuCreateDto): Promise<Menu> => {
        const menu = new Menu();
        menu.setMenuName = dto.name;
        menu.setMenuPrice = dto.price;
        menu.setMenuDesc = dto.description;
        menu.setMenuState = dto.state;
        menu.store_id = dto.store_id;
        return menu;
    }

    private MenuExist = async (name:string, price: number, description: string, state:string): Promise<boolean> => {
      return (
        (await this.menuRepository
          .createQueryBuilder()
          .select("m.menu_id")
          .from(Menu, "m")
          .where("m.name = :name",{name})
          .andWhere("m.price = :price",{price})
          .andWhere("m.description = :description",{description})
          .andWhere("m.state = :state",{state})
          .getOne()) !== undefined
      );
    };
    
    


    async saveMenu(dto: MenuCreateDto): Promise<MenuInfoResponseDto> {
      if( await this.MenuExist(dto.name, dto.price, dto.description, dto.state )) {
        throw new ConflictException("Menu is already in use!");
      } else {
        const menu = await this.menuRepository.save(
          await this.menuCreateDtoToEntity(dto)
        );
        return new MenuInfoResponseDto(menu);
      }
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
    .update( "menus", { ...dto })
    .where("menu_id = :menuId", { menuId })
    .execute();
    if(result.affected !== 0) {
      return new BasicMessageDto("Updated Successfully.");
    } else throw new NotFoundException();
  }
    
  async removeMenu(menuId : number): Promise<BasicMessageDto> {
    const result = await this.menuRepository.delete(menuId);
    if (result.affected !== 0) {
      return new BasicMessageDto("Deleted Successfully.");
    } else throw new NotFoundException();
  }

}