import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";

export class CategoryCreateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  state: boolean;

  @IsArray()
  menus: number[];

  @IsString()
  role: string;
}
