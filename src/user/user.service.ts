import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BasicMessageDto } from "../common/dtos/basic-massage.dto";
import { User } from "../entities/user/user.entity";
import { Repository } from "typeorm";
import { UserCreateDto } from "./dtos/create-user.dto";
import { UserUpdateDto } from "./dtos/update-user.dto";
import { UserInfoResponseDto } from "./dtos/user-info.dto";
import { UserLoginRequestDto } from "./dtos/user-login-request.dto";
import { UserLoginResponseDto } from "./dtos/user-login-response.dto";
import {
  generateAccessToken,
  generateRefreshToken,
  regenerateAccessToekn,
} from "../utils/auth/jwt-token-util";
import { RefreshTokenDto } from "./dtos/user-refreshToken.dto";
import { RegenerateAccessTokenDto } from "../refresh/dtos/user-regenerateAccessToken.dto";
import { RefreshToken } from "src/entities/token/token.entity";
import { async } from "rxjs";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshtokenRepository: Repository<RefreshToken>
  ) {}

  private userCreateDtoToEntity = (dto: UserCreateDto): User => {
    const user = new User();
    user.setName = dto.name;
    user.setEmail = dto.email;
    user.setPhone_number = dto.phone_number;
    user.setPassword = dto.password;
    user.setUserRole = dto.user_role;
    return user;
  };

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
    const user = await this.userRepository.findOne(userId, {
      relations: ["stores"],
    });
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

  private makeRefreshtokenEntity = async (
    refreshtokenstring: string,
    userId: number
  ): Promise<RefreshToken> => {
    const refreshtoken = new RefreshToken();
    refreshtoken.setrefreshtoken = refreshtokenstring;
    refreshtoken.setuser_id = userId;
    return refreshtoken;
  };

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
      const user_id = user.getUser_id;
      const targettoken = await this.refreshtokenRepository
        .createQueryBuilder()
        .select("r")
        .from(RefreshToken, "r")
        .where("r.user_id =:user_id", { user_id })
        .getOne();
      if (targettoken !== undefined) {
        await this.refreshtokenRepository.delete(targettoken);
      }
      const dto = new UserLoginResponseDto(user);
      dto.accessToken = generateAccessToken(user.getUser_id);
      const refreshtokenString = generateRefreshToken(user.getUser_id);
      await this.refreshtokenRepository.save(
        await this.makeRefreshtokenEntity(refreshtokenString, dto.user_id)
      );
      const refreshTokenIndex = await this.refreshtokenRepository
        .createQueryBuilder()
        .select("r")
        .from(RefreshToken, "r")
        .where("r.refreshtoken =:refreshtokenString", { refreshtokenString })
        .getOne();
      dto.refreshTokenIndex = Number(refreshTokenIndex.gettoken_id);
      return dto;
    } else throw new NotFoundException();
  }

  //   async refresh(
  //     authorization: string,
  //     refreshtoken_index: string
  //   ): Promise<RegenerateAccessTokenDto> {
  //     const refreshToken = await this.refreshtokenRepository
  //       .createQueryBuilder()
  //       .from(RefreshToken, "r")
  //       .where("r.token_id =:", { refreshtokenString })
  //       .getOne();
  //     const newAccessToken = regenerateAccessToekn(refreshToken);
  //     return new RegenerateAccessTokenDto(newAccessToken);
  //   }
  //
}
