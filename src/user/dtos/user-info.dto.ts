import { User } from "../../entities/user/user.entity";

export class UserInfoResponseDto {
  constructor(user: User) {
    this.user_id = user.getUser_id;
    this.name = user.getName;
    this.phone_number = user.getPhone_number;
    this.email = user.getEmail;
  }
  user_id: number;
  name: string;
  phone_number: string;
  email: string;
}