import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../../../src/entities/category/category.entity";
import { Menu } from "../../../src/entities/menu/menu.entity";
import { OptionGroup } from "../../../src/entities/option/optionGroup.entity";
import { Repository } from "typeorm";
import {
  MenuboardCategoryAndMenuResponseDto,
  OptiongroupOptionDto,
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

  async getCategoryAndMenuByStoreId(
    storeId: string
  ): Promise<MenuboardCategoryAndMenuResponseDto[]> {
    const DecoStoreId = Buffer.from(storeId, "base64").toString("binary");
    const categories = await this.categoryRepository
      .createQueryBuilder("category")
      .innerJoinAndSelect("category.menus", "menu")
      .where("category.store_id =:DecoStoreId", { DecoStoreId })
      .getMany();
    return categories.map(
      (category) => new MenuboardCategoryAndMenuResponseDto(category)
    );
  }

  async getOptionGroupAndOptionBymenuId(
    menuId: number
  ): Promise<OptiongroupOptionDto[]> {
    const menuDetail = await this.menuRepository
      .createQueryBuilder("menu")
      .innerJoinAndSelect("menu.optionGroups", "option_groups")
      .where("menu.menu_id =:menuId", { menuId })
      .getOne();
    const optiongroups: OptiongroupOptionDto[] = [];
    for (var i = 0; i < menuDetail.optionGroups.length; i++) {
      const optiongroupId = menuDetail.optionGroups[i].getOptionGroupId;
      const tempOptiongroup = await this.optiongroupRepository
        .createQueryBuilder("optiongroup")
        .innerJoinAndSelect("optiongroup.option_id", "options")
        .where("optiongroup.option_group_id =:optiongroupId", {
          optiongroupId,
        })
        .getOne();
      optiongroups.push(new OptiongroupOptionDto(tempOptiongroup));
    }

    return optiongroups;
  }
}

// const optiongroups: OptiongroupOptionDto[] = [];
// for (var i = 0; i < optiongroupId.length; i++) {
//   const optiongroupIddd = optiongroupId[i];
//   const optiongroups111 = await this.optiongroupRepository
//     .createQueryBuilder("optiongroup")
//     .innerJoinAndSelect("optiongroup.option_id", "options")
//     .where("optiongroup.option_group_id =:optiongroupIddd", {
//       optiongroupIddd,
//     })
//     .getOne();

//   optiongroups.push(new OptiongroupOptionDto(optiongroups111));
// }

// const optiongroups = optiongroupId.map((optiongroupId) =>
//   await this.optiongroupRepository
//     .createQueryBuilder("optiongroup")
//     .innerJoinAndSelect("optiongroup.option_id", "options")
//     .where("optiongroup.option_group_id =:optiongroupId", { optiongroupId })
//     .getOne()
// );

//   console.log((await ii[0]).getOptionGroupDesc);
//   return new MenuboardMenuDetailResponseDto(menuDetail);
// }

// async getOptionByOptiongroupId(
//   optiongroupId: number
// ): Promise<MenuboardOptionResponseDto> {
//   const optiongroup = await this.optiongroupRepository
//     .createQueryBuilder("optiongroup")
//     .innerJoinAndSelect("optiongroup.option_id", "options")
//     .where("optiongroup.option_group_id =:optiongroupId", { optiongroupId })
//     .getOne();
//   return new MenuboardOptionResponseDto(optiongroup);
// }

// async getMenuByCategoryId(
//   categoryId: number
// ): Promise<MenuboardMenuResponseDto> {
//   const menus = await this.categoryRepository
//     .createQueryBuilder("category")
//     .innerJoinAndSelect("category.menus", "menu")
//     .where("category.category_id =:categoryId", { categoryId })
//     .getOne();

//   return new MenuboardMenuResponseDto(menus);
// }
// }
