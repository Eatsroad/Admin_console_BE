import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoryService } from "src/console/category/category.service";
import { MenuboardCategoryResponseDto } from "./dtos/menuboard-info.dto";
import { MenuboardService } from "./menuboard.service";

@Controller("menuboard")
@ApiTags("메뉴판 API")
export class MenuboardController {
  constructor(private readonly menuBoardService: MenuboardService) {}

  @Get()
  getAllCategory(
    @Query("storeId") storeId: number
  ): Promise<MenuboardCategoryResponseDto[]> {
    return this.menuBoardService.getCategoryByStoreId(storeId);
  }
}
