import { Menu } from "src/entities/menu/menu.entity";
import { Store } from "../../../../src/entities/store/store.entity";

export interface MenuPreviewInfo {
    name: string;
    menu_id: number;
};

export class StoreInfoResponseDto{
    constructor(store: Store){
        this.store_id = store.getStore_id;
        this.name = store.getName;
        this.address = store.getAddress;
        this.phone_number = store.getPhone_number;
        this.tables = store.getTables;
        this.menus = store.menus;
    }
    store_id: number;
    name: string;
    address: string;
    phone_number: string;
    tables: number;
    menus: Menu[];
}