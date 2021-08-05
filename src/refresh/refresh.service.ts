import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "src/entities/token/token.entity";
import { UserLoginResponseDto } from "src/user/dtos/user-login-response.dto";
import {
  generateAccessToken,
  generateRefreshToken,
  regenerateAccessToekn,
} from "src/utils/auth/jwt-token-util";
import { Repository } from "typeorm";
import { RegenerateAccessTokenDto } from "./dtos/user-regenerateAccessToken.dto";

@Injectable()
export class RefreshService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshtokenRepository: Repository<RefreshToken>
  ) {}

  private makeRefreshtokenEntity = async (
    refreshtokenstring: string,
    userId: number
  ): Promise<RefreshToken> => {
    const refreshtoken = new RefreshToken();
    refreshtoken.setrefreshtoken = refreshtokenstring;
    refreshtoken.setuser_id = userId;
    return refreshtoken;
  };

  async refresh(userId: number): Promise<RegenerateAccessTokenDto> {
    const accessToken = generateAccessToken(userId);
    const refreshtokenString = generateRefreshToken(userId);
    await this.refreshtokenRepository.save(
      await this.makeRefreshtokenEntity(refreshtokenString, userId)
    );
    const refreshtokenNew = await this.refreshtokenRepository
      .createQueryBuilder()
      .select("r")
      .from(RefreshToken, "r")
      .where("r.refreshtoken =:refreshtokenString", { refreshtokenString })
      .getOne();
    const refreshTokenIndex = Number(refreshtokenNew.gettoken_id);
    const dto = new RegenerateAccessTokenDto(accessToken, refreshTokenIndex);
    return dto;
  }
}
