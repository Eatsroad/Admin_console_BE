import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request } from '@nestjs/common';
import { request } from 'express';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { StoreCreateDto } from './dtos/create-store.dto';
import { StoreInfoResponseDto } from './dtos/store-info-dto';
import { StoreUpdateDto } from './dtos/update-store.dto';
import { StoreService } from './store.service';

@Controller('/store')
export class StoreController {
    constructor(
        private readonly StoreService: StoreService){}

@Post()
saveStore(@Body() dto: StoreCreateDto, @Request() req): Promise<StoreInfoResponseDto>{
  return this.StoreService.saveStore(dto, req);
  }


@Get('/:storeId')
getStoreInfo(
  @Param('storeId', ParseIntPipe) storeid:number
  ):Promise<StoreInfoResponseDto>{
  return this.StoreService.getStoreInfo(storeid);
  }

@Put('/:storeId')
updateStoreInfo(
  @Param('storeId', ParseIntPipe) storeId: number,
  @Body() dto: StoreUpdateDto,//
): Promise<BasicMessageDto> {
  return this.StoreService.updateStoreInfo(storeId, dto);
}  

@Delete('/:storeId')
removeStore(
  @Param('storeId', ParseIntPipe) storeId: number,
) {
  return this.StoreService.removeStore(storeId);
}
}