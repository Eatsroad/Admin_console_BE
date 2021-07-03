import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsNumber, IsOptional } from "class-validator";
import { MenuCreateDto } from "./create-menu.dto";

export class MenuUpdateDto extends PartialType(MenuCreateDto) {
    @IsOptional()
    @IsArray()
    optionGroups : number[];
    
    @IsOptional()
    @IsArray()
    categories : number[];

    @IsOptional()
    @IsNumber()
    enable_time: number;
}