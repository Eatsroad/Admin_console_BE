import { Request } from "@nestjs/common";
import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "src/console/category/category.service";
import IStoreRequest from "src/interfaces/store-request";
import {
  MenuboardCategoryAndMenuResponseDto,
  MenuSummaryDto,
  OptiongroupOptionDto,
  StoreSummaryDto,
} from "./dtos/menuboard-info.dto";
import { MenuboardService } from "./menuboard.service";

@Controller("menuboard")
@ApiTags("메뉴판 API")
export class MenuboardController {
  constructor(private readonly menuBoardService: MenuboardService) {}

  @Get("/categoryAndMenu")
  @ApiOperation({
    summary: "카테고리, 메뉴 정보 API",
    description: "해당 음식점의 모든 (음식)카테고리와 해당 메뉴를 보여줍니다.",
  })
  @ApiResponse({
    description: "해당 음식점의 모든 (음식)카테고리와 해당 메뉴를 보여줍니다.",
    type: MenuboardCategoryAndMenuResponseDto,
  })
  getAllCategory(
    @Query("storeId") storeId: string
  ): Promise<MenuboardCategoryAndMenuResponseDto[]> {
    return this.menuBoardService.getCategoryAndMenuByStoreId(storeId);
  }

  @Get("/optiongroupAndOption")
  @ApiOperation({
    summary: "옵션그룹, 옵션 API",
    description: "해당 메뉴의 옵션그룹과 옵션을 보여줍니다.",
  })
  @ApiResponse({
    description: "해당 메뉴의 옵션그룹과 옵션을 보여줍니다.",
    type: OptiongroupOptionDto,
  })
  getAllOptionByOptiongroupId(
    @Query("menuId") menuId: number
  ): Promise<OptiongroupOptionDto[]> {
    return this.menuBoardService.getOptionGroupAndOptionBymenuId(menuId);
  }

  @Get("/menuSummary")
  @ApiOperation({
    summary: "메뉴 요약 API",
    description: "메뉴 요약내용을 보여줍니다.",
  })
  @ApiResponse({
    description: "메뉴 요약내용을 보여줍니다.",
    type: MenuSummaryDto,
  })
  getMenuSummaryByMenuId(
    @Query("menuId") menuId: number
  ): Promise<MenuSummaryDto> {
    return this.menuBoardService.getMenuSummaryByMenuId(menuId);
  }

  @Get("/storeSummary")
  @ApiOperation({
    summary: "가게 요약 API",
    description: "가게 요약내용을 보여줍니다.",
  })
  @ApiResponse({
    description: "가게 요약내용을 보여줍니다.",
    type: StoreSummaryDto,
  })
  getStoreSummaryByMenuId(
    @Query("storeId") storeId: number
  ): Promise<StoreSummaryDto> {
    return this.menuBoardService.getStoreSummaryByMenuId(storeId);
  }
}
