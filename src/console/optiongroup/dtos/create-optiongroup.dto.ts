import { IsArray, IsEmail, IsEnum, IsNumber, IsString } from "class-validator";

export class OptionGroupCreateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  state: string;
}