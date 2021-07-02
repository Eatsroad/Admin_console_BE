import { IsEmail, IsEnum, IsString } from "class-validator";
import { UserRole } from "../../entities/user/user.entity";

export class UserCreateDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;

  @IsString()
  password: string;

  // @IsEnum(UserRole)
  // user_role: UserRole;
}