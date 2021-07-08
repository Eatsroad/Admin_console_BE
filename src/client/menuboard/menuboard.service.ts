import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/entities/category/category.entity";
import { Menu } from "src/entities/menu/menu.entity";
import { OptionGroup } from "src/entities/option/optionGroup.entity";
import { Repository } from "typeorm";
import {
  MenuboardCategoryResponseDto,
  MenuboardMenuDetailResponseDto,
  MenuboardMenuResponseDto,
  MenuboardOptionResponseDto,
} from "./dtos/menuboard-info.dto";

@Injectable()
export class MenuboardService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(OptionGroup)
    private readonly optiongroupRepository: Repository<OptionGroup>
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

  async getOptionByOptiongroupId(
    optiongroupId: number
  ): Promise<MenuboardOptionResponseDto> {
    const optiongroup = await this.optiongroupRepository
      .createQueryBuilder("optiongroup")
      .innerJoinAndSelect("optiongroup.option_id", "options")
      .where("optiongroup.option_group_id =: optiongroupId", { optiongroupId })
      .getOne();
    return new MenuboardOptionResponseDto(optiongroup);
  }
}
