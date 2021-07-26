import { IsNumber, IsOptional, IsString } from "class-validator";

export class MenuCreateDto{
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    description: string;
    
    @IsString()
    state: string;
}