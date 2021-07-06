import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/entities/category/category.entity";
import { Menu } from "src/entities/menu/menu.entity";
import { Repository } from "typeorm";
import {
  MenuboardCategoryResponseDto,
  MenuboardMenuDetailResponseDto,
  MenuboardMenuResponseDto,
} from "./dtos/menuboard-info.dto";

@Injectable()
export class MenuboardService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>
  ) {}

  async getCategoryByStoreId(
    storeId: number
  ): Promise<MenuboardCategoryResponseDto[]> {
    const categories = await this.categoryRepository.find({
      where: {
        store: storeId,
      },
      //relations: ["menus"],
    });
    return categories.map(
      (category) => new MenuboardCategoryResponseDto(category)
    );
  }

  async getMenuByCategoryId(
    categoryId: number
  ): Promise<MenuboardMenuResponseDto> {
    const menus = await this.categoryRepository
      .createQueryBuilder("category")
      .innerJoinAndSelect("category.menus", "menu")
      .where("category.category_id =:categoryId", { categoryId })
      .getOne();

    return new MenuboardMenuResponseDto(menus);
  }

  async getDetailBymenuId(
    menuId: number
  ): Promise<MenuboardMenuDetailResponseDto> {
    const menuDetail = await this.menuRepository
      .createQueryBuilder("menu")
      .innerJoinAndSelect("menu.optionGroups", "option_groups")
      .where("menu.menu_id =:menuId", { menuId })
      .getOne();
    return new MenuboardMenuDetailResponseDto(menuDetail);
  }
}
