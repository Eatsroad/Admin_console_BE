import { IsString } from "class-validator";

export class RefreshTokenDto {
  constructor(refreshToken: string, accessToken: string) {
    //this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
  @IsString()
  refreshToken: string;
}
