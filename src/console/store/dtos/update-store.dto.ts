import { PartialType } from "@nestjs/mapped-types";
import { StoreCreateDto } from "./create-store.dto";

export class StoreUpdateDto extends PartialType(StoreCreateDto)
{}
