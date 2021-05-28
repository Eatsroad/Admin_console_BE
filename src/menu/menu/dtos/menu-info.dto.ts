import { Menu } from "src/entities/menu/menu.entity";

export class MenuInfoResponseDto{
    constructor(menu : Menu){
        this.menu_id = menu.getMenu_id;
        this.name = menu.getName;
        this.price = menu.getPrice;
        this.desc = menu.getDesc;
        this.state= menu.getState;
        this.category_id=menu.getCategory_id;
        this.option_group_id=menu.getOption_group_id;
        this.event_group_id=menu.getEvent_group_id;
    }
    menu_id: number;
    name: string;
    price: number;
    desc: string;
    state: boolean;
    event_group_id: number;
    category_id : number;
    option_group_id :number;
}