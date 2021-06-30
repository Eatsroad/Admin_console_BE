import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";
import { CategoryRole } from "src/entities/category/category.entity";

export class CategoryCreateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  state: string;

  @IsArray()
  menus: number[];

  @IsString()
  role: CategoryRole;
}
