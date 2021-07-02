import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsNumber, IsOptional } from "class-validator";
import { Category } from "../../../../src/entities/category/category.entity";
import { OptionGroup } from "../../../../src/entities/option/optionGroup.entity";
import { EnableTime } from "../../../../src/entities/menu/enableTime.entity";
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