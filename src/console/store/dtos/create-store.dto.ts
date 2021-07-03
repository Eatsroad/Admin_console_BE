import { IsNumber, IsString } from "class-validator";

export class StoreCreateDto{
    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsString()
    phone_number: string;

    @IsNumber()
    tables: number;
    
}