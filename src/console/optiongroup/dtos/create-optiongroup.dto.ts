import { IsArray, IsEmail, IsEnum, IsNumber, IsString } from "class-validator";

export class OptionGroupCreateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  state: string;

  @IsArray()
  option_id: number[];

  @IsNumber()
  store_id: number;
}