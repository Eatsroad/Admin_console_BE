import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicMessageDto } from '../../../src/common/dtos/basic-massage.dto';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuInfoResponseDto } from './dtos/menu-info.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
import { MenuService } from './menu.service' 

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
  saveMenu(
    @Body() dto: MenuCreateDto,
  ): Promise<MenuInfoResponseDto>{
    return this.menuService.saveMenu(dto);
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

  @Delete('/:menuId/category')
  @ApiOperation({
    summary: '메뉴의 카테고리 삭제 API',
    description: '요청된 메뉴 id에 해당하는 메뉴의 카테고리를 삭제합니다.'
  })
  @ApiResponse({
    description: '요청된 메뉴 id에 해당하는 메뉴의 카테고리를 삭제합니다.'
  })
  removeCategory(
    @Param('menuId', ParseIntPipe) menuId: number,
  ) {
    return this.menuService.removeCategoryInMenu(menuId);
  }

  @Delete('/:menuId/optiongroup')
  @ApiOperation({
    summary: '메뉴의 옵션그룹 삭제 API',
    description: '요청된 메뉴 id에 해당하는 메뉴의 옵션그룹을 삭제합니다.'
  })
  @ApiResponse({
    description: '요청된 메뉴 id에 해당하는 메뉴의 옵션그룹을 삭제합니다.'
  })
  removeOptionGroup(
    @Param('menuId', ParseIntPipe) menuId: number,
  ) {
    return this.menuService.removeOptionGroupInMenu(menuId);
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
  updateMenuInfo(
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() dto: MenuUpdateDto,
  ): Promise<BasicMessageDto> {
    return this.menuService.updateMenuInfo(menuId, dto);
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
  updateEnableTime(
    @Param('menuId') menuId: number,
    @Body() menu:MenuUpdateDto, 
  ): Promise<BasicMessageDto>{
    return this.menuService.updateEnableTimeInMenu(menuId, menu);
  }
}


