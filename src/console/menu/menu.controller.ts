import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuInfoResponseDto } from './dtos/menu-info.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
import { MenuService } from './menu.service';


@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService, 
  ) {}

  @Post()
  saveMenu(
    @Body() dto: MenuCreateDto,
  ): Promise<MenuInfoResponseDto>{
    return this.menuService.saveMenu(dto);
  }

  @Get('/:menuId')
  getMenuInfo(@Param('menuId', ParseIntPipe) menuId: number,): Promise<MenuInfoResponseDto>{
    return this.menuService.getMenuInfo(menuId);
  }

  @Delete('/:menuId')
  removeMenu(
    @Param('menuId', ParseIntPipe) menuId: number,
  ) {
    return this.menuService.removeMenu(menuId);
  }

  @Put('/:menuId')
  updateMenuInfo(
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() dto: MenuUpdateDto,
  ): Promise<BasicMessageDto> {
    return this.menuService.updateMenuInfo(menuId, dto);
  }  
}


