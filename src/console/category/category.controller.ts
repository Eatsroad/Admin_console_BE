import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { CategoryService } from './category.service';
import { CategoryCreateDto } from './dto/category-info.dto';
import { CategoryInfoResponseDto } from './dto/create-category.dto';
import { CategoryUpdateDto } from './dto/update-menu.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService : CategoryService,
    ) {}
    @Post()
    saveCategory(@Body() dto: CategoryCreateDto) : Promise<CategoryInfoResponseDto>{
        return this.categoryService.saveCategory(dto);
    }

    @Get('/:categoryId')
    getCategoryInfo(@Param('categoryId', ParseIntPipe) categoryId: number,): Promise<CategoryInfoResponseDto>{
        return this.categoryService.getCategoryInfo(categoryId);
    }
    @Delete('/:categoryId')
    removeCategory(
        @Param('categoryId', ParseIntPipe) categoryId: number,
      ) {
        return this.categoryService.removeCategory(categoryId);
      }
      @Put('/:categoryId')
    updateCategoryInfo(
        @Param('categoryId', ParseIntPipe) categoryId: number,
        @Body() dto: CategoryUpdateDto,
      ): Promise<BasicMessageDto> {
        return this.categoryService.updateCategoryInfo(categoryId, dto);
      }  
}
