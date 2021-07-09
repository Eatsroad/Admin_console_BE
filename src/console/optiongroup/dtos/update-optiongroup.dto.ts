import { PartialType } from "@nestjs/mapped-types";
import { OptionGroupCreateDto } from "./create-optiongroup.dto";

export class OptionGroupUpdateDto extends PartialType(OptionGroupCreateDto) {}