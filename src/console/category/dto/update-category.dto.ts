import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CategoryCreateDto } from "./create-categoty.dto";

export class CategoryUpdatedto extends PartialType(CategoryCreateDto) {};