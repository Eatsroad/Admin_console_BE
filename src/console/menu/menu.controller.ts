import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, Request, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import IStoreRequest from 'src/interfaces/store-request';
import { Connection, QueryRunner, TransactionManager } from 'typeorm';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuInfoResponseDto } from './dtos/menu-info.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
import { MenuService } from './menu.service' 
import {getConnection} from "typeorm";
import { TransactionInterceptor } from 'src/interceptor/transaction.interceptor';
import { request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as dotenv from 'dotenv';
dotenv.config();
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId:process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
});

@Controller('menu')
@ApiTags('menu API')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: '메뉴 기본 생성 API',
    description: '메뉴를 생성합니다.'
  })
  @ApiResponse({
    description: '메뉴를 생성합니다.',
    type: MenuInfoResponseDto
  })
  @UseInterceptors(TransactionInterceptor)
  saveMenu(
    @Body() dto: MenuCreateDto,
    @Request() req:IStoreRequest
  ): Promise<MenuInfoResponseDto>{
    return this.menuService.saveMenu(dto, req.storeId);
  }

  @Get('/:menuId')
  @ApiOperation({
    summary : '메뉴 정보 API',
    description: '요청된 메뉴 id에 해당하는 메뉴를 가져옵니다.'
  })
  @ApiResponse({
    description: '요청된 메뉴 id에 해당하는 메뉴를 가져옵니다.',
    type : MenuInfoResponseDto
  })
  getMenuInfo(@Param('menuId', ParseIntPipe) menuId: number,): Promise<MenuInfoResponseDto>{
    return this.menuService.getMenuInfo(menuId);
  }

  @Post('/:menuId/image')
  @UseInterceptors(FilesInterceptor('images', 3, {
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      resize: {
        width: 400,
        height: 400
      },
      max: true,
      key: function(req, file, cb) {
        cb(null, file.originalname)
      }
    })
  }))
  fileUpload(@UploadedFiles() file: Express.Multer.File, @Param('menuId', ParseIntPipe) menuId:number){
    const UploadedFile = this.menuService.uploadFile(file);
    const result = this.menuService.updateFileInMenu(UploadedFile, menuId);
    return result;
  }


  @Get()
  @ApiOperation({
    summary : '메뉴 전체 정보 API',
    description: '요청된 가게 id에 해당하는 메뉴 전체를 가져옵니다.'
  })
  @ApiResponse({
    description: '요청된 가게 id에 해당하는 메뉴 전체를 가져옵니다.',
    type : MenuInfoResponseDto
  })
  getMenuList( @Request() req: IStoreRequest): Promise<MenuInfoResponseDto[]>{
    return this.menuService.getMenuList(req.storeId);
  }

  @Delete('/:menuId')
  @ApiOperation({
    summary: '메뉴 삭제 API',
    description: '요청된 메뉴 id에 해당하는 메뉴를 삭제합니다.'
  })
  @ApiResponse({
    description: '요청된 메뉴 id에 해당하는 메뉴를 삭제합니다.'
  })
  removeMenu(
    @Param('menuId', ParseIntPipe) menuId: number,
  ) {
    return this.menuService.removeMenu(menuId);
  }

  @Delete('/:menuId/enabletime')
  @ApiOperation({
    summary: '메뉴의 판매가능시간 삭제 API',
    description: '요청된 메뉴 id에 해당하는 메뉴의 정기적인 판매가능시간을 삭제합니다.'
  })
  @ApiResponse({
    description: '요청된 메뉴 id에 해당하는 메뉴의 정기적인 판매가능시간을 삭제합니다.'
  })
  removeEnableTime(
    @Param('menuId', ParseIntPipe) menuId: number,
  ) {
    return this.menuService.removeEnableTimeInMenu(menuId);
  }

  @Put('/:menuId')
  @ApiOperation({
    summary: '메뉴 업데이트 API',
    description: '메뉴의 이름, 가격, 설명, (일시적)상태를 업데이트합니다.'
  })
  @ApiResponse({
    description: '메뉴의 이름, 가격, 설명, (일시적)상태를 업데이트합니다.',
    type: BasicMessageDto
  })
  @UseInterceptors(TransactionInterceptor)
  updateMenuInfo(
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() dto: MenuUpdateDto,
    @Request() req:IStoreRequest
  ): Promise<BasicMessageDto> {
    return this.menuService.updateMenuInfo(menuId, dto, req.storeId);
  }  

  @Patch('/:menuId/optiongroup')
  @ApiOperation({
    summary: '메뉴의 옵션그룹 업데이트 API',
    description: '메뉴의 옵션그룹만을 업데이트합니다.'
  })
  @ApiResponse({
    description: '메뉴의 옵션그룹만을 업데이트합니다.',
    type: BasicMessageDto
  })
  @UseInterceptors(TransactionInterceptor)
  updateOptiongroup(
    @Param('menuId') menuId: number,
    @Body() menu:MenuUpdateDto,  
  ): Promise<BasicMessageDto> {
    return this.menuService.updateOptionGroupInMenu(menuId, menu);
  }

  @Patch('/:menuId/category')
  @ApiOperation({
    summary: '메뉴의 카테고리 업데이트 API',
    description: '메뉴의 카테고리만을 업데이트합니다.'
  })
  @ApiResponse({
    description: '메뉴의 카테고리만을 업데이트합니다.',
    type: BasicMessageDto
  })
  @UseInterceptors(TransactionInterceptor)
  updateCategory(
    @Param('menuId') menuId: number,
    @Body() menu:MenuUpdateDto, 
  ): Promise<BasicMessageDto>{
    return this.menuService.updateCategoryInMenu(menuId, menu);
  }

  @Patch('/:menuId/enabletime')
  @ApiOperation({
    summary: '메뉴의 판매가능시간 업데이트 API',
    description: '메뉴의 정기적인 판매가능시간만을 업데이트합니다.'
  })
  @ApiResponse({
    description: '메뉴의 정기적인 판매가능시간만을 업데이트합니다.',
    type: BasicMessageDto
  })
  @UseInterceptors(TransactionInterceptor)
  updateEnableTime(
    @Param('menuId') menuId: number,
    @Body() menu:MenuUpdateDto, 
  ): Promise<BasicMessageDto>{
    return this.menuService.updateEnableTimeInMenu(menuId, menu);
  }


}


