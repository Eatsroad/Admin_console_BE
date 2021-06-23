import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional } from "class-validator";
import { Category } from "src/entities/category/category.entity";
import { EnableTime } from "src/entities/menu/enableTime.entity";
import { OptionGroup } from "src/entities/option/optionGroup.entity";
import { MenuCreateDto } from "./create-menu.dto";


export class MenuUpdateDto extends PartialType(MenuCreateDto) {
    @IsOptional()
    categories: Category[];
    
    @IsOptional()
    optionGroups:OptionGroup[];

    @IsOptional()
    @IsNumber()
    enable_time:EnableTime;
}