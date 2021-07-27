import { Request } from "@nestjs/common";
import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "src/console/category/category.service";
import IStoreRequest from "src/interfaces/store-request";
import {
  MenuboardCategoryAndMenuResponseDto,
  OptiongroupOptionDto,
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
}
