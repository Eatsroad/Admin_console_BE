import { Store } from "src/entities/store/store.entity";

export class StoreInfoResponseDto{
    constructor(store: Store){
        this.store_id = store.getStore_id;
        this.name = store.getName;
        this.address = store.getAddress;
        this.phone_number = store.getPhone_number
    }
    store_id: number;
    name: string;
    address: string;
    phone_number:string;
}