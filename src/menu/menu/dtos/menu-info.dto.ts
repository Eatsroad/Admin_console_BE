import { Menu } from "src/entities/menu/menu.entity";

export class MenuInfoResponseDto{
    constructor(menu : Menu){
        this.menu_id = menu.getMenu_id;
        this.store_id = menu.store_id;
        this.name = menu.getName;
        this.price = menu.getPrice;
        this.desc = menu.getDesc;
        this.state= menu.getState;
        this.category_id = menu.getCategory_id;
        this.enable_time = menu.getEnable_time;
        // this.event_group_id=menu.getEvent_group_id;
    }
    menu_id: number;
    store_id:number;
    name: string;
    price: number;
    desc: string;
    state: string;
    //event_group_id: number;
    category_id : number;
    enable_time:number;
}