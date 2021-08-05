import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from "@nestjs/common";
import { BasicMessageDto } from "../../src/common/dtos/basic-massage.dto";
import { UserCreateDto } from "./dtos/create-user.dto";
import { UserUpdateDto } from "./dtos/update-user.dto";
import { UserInfoResponseDto } from "./dtos/user-info.dto";
import { UserLoginRequestDto } from "./dtos/user-login-request.dto";
import { UserLoginResponseDto } from "./dtos/user-login-response.dto";
import { UserService } from "./user.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import IUserRequest from "src/interfaces/user-request";
import { Request } from "@nestjs/common";
<<<<<<< HEAD
import { RefreshTokenDto } from "./dtos/user-refreshToken.dto";
=======
import { TransactionInterceptor } from "src/interceptor/transaction.interceptor";
>>>>>>> develop

@Controller("user")
@ApiTags("user API")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: "유저 생성 API",
    description: "유저를 생성합니다.",
  })
  @ApiResponse({
    description: "유저를 생성합니다.",
    type: UserInfoResponseDto,
  })
  @UseInterceptors(TransactionInterceptor)
  saveUser(@Body() dto: UserCreateDto): Promise<UserInfoResponseDto> {
    return this.userService.saveUser(dto);
  }

  @Get()
  getUserInfo(@Request() req: IUserRequest): Promise<UserInfoResponseDto> {
    return this.userService.getUserInfo(req.userId);
  }

  @Put()
  @UseInterceptors(TransactionInterceptor)
  updateUserInfo(
    @Request() req: IUserRequest,
    @Body() dto: UserUpdateDto
  ): Promise<BasicMessageDto> {
    return this.userService.updateUserInfo(req.userId, dto);
  }

  @Delete()
  removeUser(@Request() req: IUserRequest) {
    return this.userService.removeUser(req.userId);
  }


  @Post("/signin")
  login(@Body() dto: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    return this.userService.login(dto);
  }

  // @Post("/refresh")
  // refresh(
  //   @Headers("authorization") authorization: string,
  //   @Headers("refreshtoken_index") refreshtoken_index: string
  // ) {
  //   return this.userService.refresh(authorization, refreshtoken_index);
  // }
  // @Post('/board/:userId')
  // saveBoard(
  //   @Body() dto: BoardCreateDto,
  //   @Req() req: IUserRequest,
  //   @Param('userId') userId: number,
  // ): Promise<BoardInfoResponseDto> {
  //   return this.boardSerive.saveBoard(dto, req.accessToken, userId);
  // }

  // @Patch('/board/:userId/:boardId')
  // updateBoard(
  //   @Body() dto: BoardUpdateDto,
  //   @Req() req: IUserRequest,
  //   @Param('userId') userId: number,
  //   @Param('boardId') boardId: number,
  // ): Promise<BasicMessageDto> {
  //   return this.boardSerive.updateBoard(dto, req.accessToken, userId, boardId);
  // }

  // @Delete('/board/:userId/:boardId')
  // removeBoard(
  //   @Req() req: IUserRequest,
  //   @Param('userId') userId: number,
  //   @Param('boardId') boardId: number,
  // ): Promise<BasicMessageDto> {
  //   return this.boardSerive.removeBoard(req.accessToken, userId, boardId);
  // }
}
