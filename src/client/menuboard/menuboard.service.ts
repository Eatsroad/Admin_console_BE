import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../../../src/entities/category/category.entity";
import { Menu } from "../../../src/entities/menu/menu.entity";
import { OptionGroup } from "../../../src/entities/option/optionGroup.entity";
import { Repository } from "typeorm";
import {
  MenuboardCategoryAndMenuResponseDto,
  MenuSummaryDto,
  OptiongroupOptionDto,
  StoreSummaryDto,
} from "./dtos/menuboard-info.dto";
import { Store } from "../../../src/entities/store/store.entity";
import { BasicMessageDto } from "src/common/dtos/basic-massage.dto";

@Injectable()
export class MenuboardService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
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
    try {
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
    } catch {
      return null;
    }
    return optiongroups;
  }

  async getMenuSummaryByMenuId(menuId: number): Promise<MenuSummaryDto> {
    const menu = await this.menuRepository
      .createQueryBuilder("menu")
      .where("menu.menu_id =:menuId", { menuId })
      .getOne();

    return new MenuSummaryDto(menu);
  }

  async getStoreSummaryByMenuId(storeId: number): Promise<StoreSummaryDto> {
    const store = await this.storeRepository
      .createQueryBuilder("store")
      .where("store.store_id =:storeId", { storeId })
      .getOne();

    return new StoreSummaryDto(store);
  }
}
