import { IsArray } from "class-validator";

export class CategoryMenuUpdateDto {
  @IsArray()
  menus: number[];
}