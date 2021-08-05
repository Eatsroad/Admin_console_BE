import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from '../common/dtos/basic-massage.dto';
import { User } from '../entities/user/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dtos/create-user.dto';
import { UserUpdateDto } from './dtos/update-user.dto';
import { UserInfoResponseDto } from './dtos/user-info.dto';
import { UserLoginRequestDto } from './dtos/user-login-request.dto';
import { UserLoginResponseDto } from './dtos/user-login-response.dto';
import { generateAccessToken } from '../utils/auth/jwt-token-util';


@Injectable() 
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  private userCreateDtoToEntity = (dto: UserCreateDto): User => {
    const user = new User();
    user.setName = dto.name;
    user.setEmail = dto.email;
    user.setPhone_number = dto.phone_number;
    user.setPassword = dto.password;
    user.setUserRole = dto.user_role;
    return user;
  }

  private isEmailUsed = async (email: string): Promise<boolean> => {
    return (
      (await this.userRepository
        .createQueryBuilder()
        .select("u.user_id")
        .from(User, "u")
        .where("u.email = :email", { email })
        .getOne()) !== undefined
    );
  };

  async saveUser(dto: UserCreateDto): Promise<UserInfoResponseDto> {
    try{
    if (await this.isEmailUsed(dto.email)) {
      throw new ConflictException("Email is already in use!");
    } else {
      const user = await this.userRepository.save(
        this.userCreateDtoToEntity(dto)
      );
      return new UserInfoResponseDto(user);
    }
  } catch(e){
    return e;
  }
  }

  async getUserInfo(userId: number): Promise<UserInfoResponseDto> {
    const user = await this.userRepository.findOne(userId, {relations: ["stores"]});
    if (!!user) {
      return new UserInfoResponseDto(user);
    } else {
      throw new NotFoundException();
    }
  }
  
  async updateUserInfo(
    userId: number,
    dto: UserUpdateDto
  ): Promise<BasicMessageDto> {
    const result = await this.userRepository
      .createQueryBuilder()
      .update("users", { ...dto })
      .where("user_id = :userId", { userId })
      .execute();
    if (result.affected !== 0) {
      return new BasicMessageDto("Updated Successfully.");
    } else try{
      throw new NotFoundException();
    } catch(e){
      return e;
    }
  }

  async removeUser(userId: number): Promise<BasicMessageDto> {
    
    const result = await this.userRepository.delete(userId);
    if (result.affected !== 0) {
      return new BasicMessageDto("Deleted Successfully.");
    } else throw new NotFoundException();
  }
  
  async login(dto: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    const email = dto.email;
    const password = dto.password;
    const user = await this.userRepository.findOne({
      where: {
        email: email,
        password: password,
      },
    });
    if (!!user) {
      const dto = new UserLoginResponseDto(user);
      dto.accessToken = generateAccessToken(user.getUser_id);
      return dto;
    } else throw new NotFoundException();
  }

  
}
