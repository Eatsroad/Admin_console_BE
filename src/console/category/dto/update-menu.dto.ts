import { PartialType } from "@nestjs/mapped-types";
import { CategoryCreateDto } from "./category-info.dto";



export class CategoryUpdateDto extends PartialType(CategoryCreateDto) {
}