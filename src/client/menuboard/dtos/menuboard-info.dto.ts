import { OptionGroup } from "src/entities/option/optionGroup.entity";
import { Category } from "../../../../src/entities/category/category.entity";
import { Menu } from "../../../../src/entities/menu/menu.entity";

export class MenuboardCategoryResponseDto {
  constructor(category: Category) {
    this.category_id = category.getCategoryId;
    this.name = category.getCategoryName;
    this.description = category.getCategoryDesc;
    this.state = category.getCategoryState;
    this.role = category.getCategoryRole;
  }
  name: string;
  description: string;
  state: string;
  category_id: number;
  role: string;
}
export class MenuboardMenuResponseDto {
  constructor(category: Category) {
    this.name = category.getCategoryName;
    this.menus = category.menus;
  }
  name: string;
  menus: Menu[];
}

export class MenuboardMenuDetailResponseDto {
  constructor(menu: Menu) {
    this.name = menu.getMenuName;
    this.optiongroups = menu.optionGroups;
  }
  name: string;
  optiongroups: OptionGroup[];
}
