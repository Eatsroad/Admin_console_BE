import { Controller, Post, Request } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import ITokenRequest from "src/interfaces/token-request";
import { RegenerateAccessTokenDto } from "./dtos/user-regenerateAccessToken.dto";
import { RefreshService } from "./refresh.service";

@Controller("refresh")
export class RefreshController {
  constructor(private readonly refreshService: RefreshService) {}

  @Post()
  @ApiOperation({
    summary: "엑세스토큰 재발급 API",
    description: "액세스 토큰을 재발급합니다.",
  })
  @ApiResponse({
    description: "액세스 토큰을 재발급합니다.",
    type: RegenerateAccessTokenDto,
  })
  refresh(@Request() req: ITokenRequest): Promise<RegenerateAccessTokenDto> {
    return this.refreshService.refresh(req.userId);
  }
}
