import { CategoryPreviewInfo } from "src/console/category/dto/category-info.dto";
import { OptionGroupPreviewInfo } from "src/console/optiongroup/dtos/optiongroup-info.dto";
import { Category } from "src/entities/category/category.entity";
import { EnableTime } from "src/entities/menu/enableTime.entity";
import { OptionGroup } from "src/entities/option/optionGroup.entity";
import { Menu } from "../../../../src/entities/menu/menu.entity";
export interface MenuPreviewInfo{
    name: string;
    menu_id: number;
}

export class MenuInfoResponseDto {
    constructor(menu : Menu){
        this.menu_id = menu.getMenuId;
        this.name = menu.getMenuName;
        this.price = menu.getMenuPrice;
        this.description = menu.getMenuDesc;
        this.state= menu.getMenuState;
        this.categories = menu.getCategoryPreviewInfo;
        this.optionGroups = menu.getOptionGroupsPreviewInfo;
        this.enable_time = menu.enable_time;
    }
    menu_id: number;
    name: string;
    price: number;
    description: string;
    state: string;
    categories: CategoryPreviewInfo[];
    optionGroups : OptionGroupPreviewInfo[];
    enable_time: EnableTime;
}

