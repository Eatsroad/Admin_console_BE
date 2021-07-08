import { PartialType } from "@nestjs/mapped-types";
import { OptionCreateDto } from "./create-option.dto";

export class OptionUpdateDto extends PartialType(OptionCreateDto){
    
}