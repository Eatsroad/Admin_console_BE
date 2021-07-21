import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsOptional } from "class-validator";
import { OptionGroupCreateDto } from "./create-optiongroup.dto";

export class OptionGroupUpdateDto extends PartialType(OptionGroupCreateDto) {
    @IsOptional()
    @IsArray()
    menus : number[];
}