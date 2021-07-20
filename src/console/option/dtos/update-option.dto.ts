import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsOptional } from "class-validator";
import { OptionCreateDto } from "./create-option.dto";

export class OptionUpdateDto extends PartialType(OptionCreateDto){
    @IsOptional()
    @IsArray()
    option_group_id: number[];
}