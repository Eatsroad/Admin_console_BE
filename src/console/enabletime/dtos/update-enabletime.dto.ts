import { PartialType } from "@nestjs/mapped-types";
import { EnableTimeCreateDto } from "./create-enabletime.dto";

export class EnableTimeUpdateDto extends PartialType(EnableTimeCreateDto){}