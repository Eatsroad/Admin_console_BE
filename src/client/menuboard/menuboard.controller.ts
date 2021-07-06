import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "src/console/category/category.service";
import { MenuboardCategoryResponseDto } from "./dtos/menuboard-info.dto";
import { MenuboardService } from "./menuboard.service";

@Controller("menuboard")
@ApiTags("메뉴판 API")
export class MenuboardController {
  constructor(private readonly menuBoardService: MenuboardService) {}

  @Get("/:storeId")
  @ApiOperation({
    summary: "카테고리 정보 API",
    description: "해당 음식점의 모든 (음식)카테고리를 보여줍니다.",
  })
  @ApiResponse({
    description: "해당 음식점의 모든 (음식)카테고리를 보여줍니다.",
    type: MenuboardCategoryResponseDto,
  })
  getAllCategory(
    @Param("storeId", ParseIntPipe) storeId: number
  ): Promise<MenuboardCategoryResponseDto[]> {
    return this.menuBoardService.getCategoryByStoreId(storeId);
  }

  @Get()
  @ApiOperation({
    summary: "카테고리 - 음식 API",
    description: "해당 카테고리에 해당하는 음식을 보여줍니다.",
  })
  @ApiResponse({
    description: "해당 카테고리에 해당하는 음식을 보여줍니다.",
    type: MenuboardCategoryResponseDto,
  })
  getCategoryByMenuId(
    @Query("storeId") storeId: number
  ): Promise<MenuboardCategoryResponseDto[]> {
    return this.menuBoardService.getCategoryByStoreId(storeId);
  }
}
