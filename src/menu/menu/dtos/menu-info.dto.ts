import { Category } from "src/entities/category/category.entity";
import { EnableTime } from "src/entities/menu/enableTime.entity";
import { Menu } from "src/entities/menu/menu.entity";
import { OptionGroup } from "src/entities/option/optionGroup.entity";
import { Store } from "src/entities/store/store.entity";

export class MenuInfoResponseDto{
    constructor(menu : Menu){
        this.menu_id = menu.getMenuId;
        this.store_id = menu.store_id;
        this.name = menu.getMenuName;
        this.price = menu.getMenuPrice;
        this.description = menu.getMenuDesc;
        this.state= menu.getMenuState;
        this.categories = menu.categories;
        this.enable_time = menu.enable_time;
        this.optionGroups = menu.optionGroups;
        // this.event_group_id=menu.getEvent_group_id;
    }
    menu_id: number;
    store_id:Store;
    name: string;
    price: number;
    description: string;
    state: string;
    optionGroups:OptionGroup[];
    categories : Category[];
    enable_time:EnableTime;
}