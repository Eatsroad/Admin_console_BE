import { isBoolean, IsBoolean, IsNumber, IsObject, IsString } from "class-validator";
import { Category } from "src/entities/category/category.entity";
import { EnableTime } from "src/entities/menu/enableTime.entity";
import { OptionGroup } from "src/entities/option/optionGroup.entity";
import { Store } from "../../../../src/entities/store/store.entity";

export class MenuCreateDto{
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    description: string;
    
    @IsString()
    state: string;

    @IsNumber()
    store_id:Store;
}