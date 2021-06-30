import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  ParseIntPipe, 
  Post, 
  Put 
} from '@nestjs/common';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { UserCreateDto } from './dtos/create-user.dto';
import { UserUpdateDto } from './dtos/update-user.dto';
import { UserInfoResponseDto } from './dtos/user-info.dto';
import { UserLoginRequestDto } from './dtos/user-login-request.dto';
import { UserLoginResponseDto } from './dtos/user-login-response.dto';
import { UserService } from './user.service';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse 
} from '@nestjs/swagger';

@Controller('user')
@ApiTags('user API')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '유저 생성 API',
    description: '유저를 생성합니다.'
  })
  @ApiResponse({
    description: '유저를 생성합니다.',
    type: UserInfoResponseDto
  })
  saveUser(@Body() dto: UserCreateDto): Promise<UserInfoResponseDto> {
    return this.userService.saveUser(dto);
  }

  @Get('/:userId')
  getUserInfo(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserInfoResponseDto> {
    return this.userService.getUserInfo(userId);
  }

  @Put('/:userId')
  updateUserInfo(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UserUpdateDto,
  ): Promise<BasicMessageDto> {
    return this.userService.updateUserInfo(userId, dto);
  }

  @Delete('/:userId')
  removeUser(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userService.removeUser(userId);
  }

  @Post('/signin')
  login(@Body() dto: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    return this.userService.login(dto);
  }

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
