import { IsAlpha, IsArray, IsNumber, IsString } from "class-validator";

export class OptionCreateDto{
    @IsArray()
    option_group_id: number[];

    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    state: string;;
}