import { IsNumber, IsString } from "class-validator";

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
    store_id: number;
}