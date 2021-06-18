import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";
import { Menu } from "src/entities/menu/menu.entity";

export class CategoryCreateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  state: boolean;

  @IsArray()
  menus: number[];
}
