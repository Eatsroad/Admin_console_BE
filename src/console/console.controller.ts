import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { ConsoleService } from './console.service';
import { StoreCreateDto } from './dtos/create-store.dto';
import { StoreInfoResponseDto } from './dtos/store-info.dto';
import { StoreUpdateDto } from './dtos/update-store.dto';

@Controller('/console')
export class ConsoleController {
    constructor(
        private readonly consoleService: ConsoleService){}

@Post()
saveStore(@Body() dto: StoreCreateDto): Promise<StoreInfoResponseDto>{
  return this.consoleService.saveStore(dto);
  }


@Get('/:storeId')
getStoreInfo(
  @Param('storeId', ParseIntPipe) storeid:number
  ):Promise<StoreInfoResponseDto>{
  return this.consoleService.getStoreInfo(storeid);
  }

@Put('/:storeId')
updateStoreInfo(
  @Param('storeId', ParseIntPipe) storeId: number,
  @Body() dto: StoreUpdateDto,//
): Promise<BasicMessageDto> {
  return this.consoleService.updateStoreInfo(storeId, dto);
}  

@Delete('/:storeId')
removeStore(
  @Param('storeId', ParseIntPipe) storeId: number,
) {
  return this.consoleService.removeStore(storeId);
}

}

/*@Get('/:userId')
getUserInfo(
  @Param('userId', ParseIntPipe) userId: number,
): Promise<UserInfoResponseDto> {
  return this.userService.getUserInfo(userId);
}
*/
/*

@Post()
saveStore(@Body() dto: StoreCreateDto): Promise<StoreInfoResponseDto> {
  return this.consoleService.saveUser(dto);
}
*/