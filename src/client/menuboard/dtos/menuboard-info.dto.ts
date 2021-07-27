import { Option } from "src/entities/option/option.entity";
import { OptionGroup } from "src/entities/option/optionGroup.entity";
import { Category } from "../../../../src/entities/category/category.entity";
import { Menu } from "../../../../src/entities/menu/menu.entity";

export class MenuboardCategoryAndMenuResponseDto {
  constructor(category: Category) {
    this.name = category.getCategoryName;
    this.description = category.getCategoryDesc;
    this.state = category.getCategoryState;
    this.role = category.getCategoryRole;
    this.menus = category.menus;
  }
  name: string;
  description: string;
  state: string;
  category_id: number;
  role: string;
  menus: Menu[];
}

export class OptiongroupOptionDto {
  constructor(optiongroup: OptionGroup) {
    this.name = optiongroup.getOptionGroupName;
    this.description = optiongroup.getOptionGroupDesc;
    this.state = optiongroup.getOptionGroupState;
    this.option = optiongroup.option_id;
  }

  name: string;
  description: string;
  state: string;
  option: Option[];
}

// export class MenuboardMenuDetailResponseDto {
//   constructor(menu: Menu) {
//     this.optiongroups = menu.optionGroups.map(
//       (optiongroup) => new OptiongroupOptionDto(optiongroup)
//     );
//   }
//   optiongroups: OptiongroupOptionDto[];
//}

// export class MenuboardOptionResponseDto {
//   constructor(optiongroup: OptionGroup) {
//     this.option_group_id = optiongroup.getOptionGroupId;
//     this.option = optiongroup.option_id;
//   }
//   option_group_id: number;
//   option: Option[];
// }

// export class MenuboardMenuResponseDto {
//   constructor(category: Category) {
//     this.name = category.getCategoryName;
//     this.menus = category.menus;
//   }
//   name: string;
//   menus: Menu[];
// }
