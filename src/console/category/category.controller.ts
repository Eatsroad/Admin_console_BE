import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  ParseIntPipe, 
  Post, 
  Put,
  Query
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse 
} from '@nestjs/swagger';
import { BasicMessageDto } from '../../common/dtos/basic-massage.dto';
import { CategoryService } from './category.service';
import { CategoryInfoResponseDto } from './dto/category-info.dto';
import { CategoryCreateDto } from './dto/create-categoty.dto';
import { CategoryMenuUpdateDto } from './dto/update-category-menus.dto';
import { CategoryUpdatedto } from './dto/update-category.dto';

@Controller('category')
@ApiTags('category API')
export class CategoryController {
  constructor(
    private readonly categpryService: CategoryService,
  ) {};
  @Get()
  getAllCategory(
    @Query('storeId') storeId: number
  ): Promise<CategoryInfoResponseDto[]> {
    return this.categpryService.getAllCategoryWithStoreId(storeId);
  }
  @Post()
  @ApiOperation({
    summary: '카테고리 생성 API',
    description: "카테고리를 생성합니다."
  })
  @ApiResponse({
    description: "카테고리를 생성합니다.",
    type: CategoryInfoResponseDto
  })
  saveCategory(
    @Body() dto: CategoryCreateDto
  ): Promise<CategoryInfoResponseDto> {
    return this.categpryService.saveCategory(dto);
  };

  @Get('/:categoryId')
  @ApiOperation({
    summary: "카테고리 정보 API",
    description: "요청된 카테고리 id에 해당하는 카테고리를 가져옵니다."
  })
  @ApiResponse({
    description: "요청된 카테고리 id에 해당하는 카테고리를 가져옵니다.",
    type: CategoryInfoResponseDto
  })
  getCategoryInfo(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CategoryInfoResponseDto> {
    return this.categpryService.getCategoryInfo(categoryId);
  };

  @Put('/:categoryId/info')
  @ApiOperation({
    summary: '카테고리 업데이트 API',
    description: "카테고리의 이름, 설명, 상태를 업데이트합니다."
  })
  @ApiResponse({
    description: "카테고리를 이름, 설명, 상태를 업데이트합니다.",
    type: BasicMessageDto
  })
  updateCategoryInfo(
    @Param('categoryId', ParseIntPipe) cateogryId: number,
    @Body() dto: CategoryUpdatedto
  ): Promise<BasicMessageDto> {
    return this.categpryService.updateCategoryInfo(cateogryId, dto);
  };

  @Put('/:categoryId/menus')
  @ApiOperation({
    summary: '카테고리 업데이트 API',
    description: "카테고리의 연결된 메뉴들을 업데이트합니다."
  })
  @ApiResponse({
    description: "카테고리를 연결된 메뉴들을 업데이트합니다.",
    type: BasicMessageDto
  })
  updateMenuInCategory(
    @Param('categoryId', ParseIntPipe) cateogryId: number,
    @Body() dto: CategoryMenuUpdateDto
  ): Promise<BasicMessageDto> {
    return this.categpryService.updateMenuInCategory(cateogryId, dto);
  };
  
  @Delete('/:categoryId')
  @ApiOperation({
    summary: '카테고리 삭제 API',
    description: "카테고리를 삭제합니다."
  })
  @ApiResponse({
    description: "카테고리를 삭제합니다.",
  })
  deleteCategory(
    @Param('categoryId', ParseIntPipe) cateogryId: number,
  ) {
    return this.categpryService.removeCategory(cateogryId);
  };
}
