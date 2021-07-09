import { IsArray, IsEmail, IsEnum, IsString } from "class-validator";

export class OptionGroupCreateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  state: string;

  @IsArray()
  option_id: number[];
}