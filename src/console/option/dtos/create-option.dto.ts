import { IsAlpha, IsArray, IsNumber, IsString } from "class-validator";

export class OptionCreateDto{
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    state: string;

    @IsNumber()
    store_id: number;
}