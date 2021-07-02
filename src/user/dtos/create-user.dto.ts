import { IsEmail, IsEnum, IsString } from "class-validator";

export class UserCreateDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;

  @IsString()
  password: string;

  @IsString()
  user_role: string;
}