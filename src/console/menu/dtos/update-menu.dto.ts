import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional } from "class-validator";
import { EnableTime } from "../../../../src/entities/menu/enableTime.entity";
import { MenuCreateDto } from "./create-menu.dto";


export class MenuUpdateDto extends PartialType(MenuCreateDto) {
    // @IsOptional()
    // @IsNumber()
    // enable_time:EnableTime;
}