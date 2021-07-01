import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

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
  role: string;
}
