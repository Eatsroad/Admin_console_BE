import { InjectInMemoryDBService, InMemoryDBEntityController, InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db/src/interfaces/in-memory-db-entity';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { Category } from 'src/entities/category/category.entity';
import { Menu } from 'src/entities/menu/menu.entity';
import { MenuEntity } from 'src/entities/menu/unittest.menu.entity';
import { OptionGroup } from 'src/entities/option/optionGroup.entity';
import { MenuCreateDto } from './dtos/create-menu.dto';
import { MenuInfoResponseDto } from './dtos/menu-info.dto';
import { MenuUpdateDto } from './dtos/update-menu.dto';
import { MenuService } from './menu.service';


@Controller('menu')
export class MenuController {
    constructor(
        @InjectInMemoryDBService('menu') private menuService: MenuService,
        
        //private readonly menuService: MenuService, 
    ) {}

    @Post()
    saveMenu(@Body() dto: MenuCreateDto): Promise<MenuInfoResponseDto>{
        return this.menuService.saveMenu(dto);
    }

    @Get('/:menuId')
    getMenuInfo(@Param('menuId', ParseIntPipe) menuId: number,): Promise<MenuInfoResponseDto>{
        return this.menuService.getMenuInfo(menuId);
    }

    
//전체삭제, 개별삭제
    @Delete('/:menuId')
    removeMenu(
        @Param('menuId', ParseIntPipe) menuId: number,
      ) {
        return this.menuService.removeMenu(menuId);
      }

    @Delete('/:menuId/category/categoryId')
    removeCategory(
        @Param('menuId', ParseIntPipe) menuId: number,
        @Body() dto:MenuUpdateDto,
      )  : Promise<BasicMessageDto>{
        return this.menuService.removeCategory(dto, menuId);
      }
    
    @Delete('/:menuId/optiongroup/optiongroupId')
    removeOptiongroup(
        @Param('menuId', ParseIntPipe) menuId: number,
        @Body() dto:MenuUpdateDto,
      ) : Promise<BasicMessageDto> {
        return this.menuService.removeOptionGroup(dto , menuId);
      }

    


      //전체업데이트, 개별업데이트
    @Put('/:menuId')
    updateMenuInfo(
        @Param('menuId', ParseIntPipe) menuId: number,
        @Body() dto: MenuUpdateDto,
      ): Promise<BasicMessageDto> {
        return this.menuService.updateMenuInfo(menuId, dto);
      }  

    @Patch('/:menuId/optiongroup/optiongroupId')
    updateOptiongroup(
      @Param('menuId') menuId: number,
      @Body('menu') menu:MenuUpdateDto,
      @Param('optiongroupId') optiongroupId:OptionGroup[]  
    ){
      return this.menuService.updateOptionGroup(menuId, menu, optiongroupId);
    }

    @Patch('/:menuId/category/categoryId')
    updateCategory(
      @Param('menuId') menuId: number,
      @Body('menu') menu:MenuUpdateDto,
      @Param('categoryId') categoryId:Category[]  
    ){
      return this.menuService.updateCategory(menuId, menu, categoryId );
    }

    

}


