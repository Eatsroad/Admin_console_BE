export class RegenerateAccessTokenDto {
  constructor(reAccessToken: string, refreshtoken_index: number) {
    this.accessToken = reAccessToken;
    this.refreshTokenIndex = refreshtoken_index;
  }

  accessToken: string;
  refreshTokenIndex: number;
}
