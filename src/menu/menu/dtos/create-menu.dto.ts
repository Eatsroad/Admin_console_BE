import { IsBoolean, IsNumber, IsString } from "class-validator";

export class MenuCreateDto{
    @IsNumber()
    menu_id: number;
    @IsNumber()
    category_id: number;
    @IsNumber()
    option_group_id: number;
    @IsNumber()
    event_group_id: number;
    @IsString()
    name: string;
    @IsNumber()
    price: number;
    @IsString()
    desc: string;
    @IsBoolean()
    state: boolean;
}