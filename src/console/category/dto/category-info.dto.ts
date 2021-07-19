
import { MenuPreviewInfo } from "src/console/menu/dtos/menu-info.dto";
import { Category } from "../../../../src/entities/category/category.entity";
export interface CategoryPreviewInfo {
  name: string;
  category_id: number;
};

export class CategoryInfoResponseDto {
  constructor(category: Category) {
    this.category_id = category.getCategoryId;
    this.name = category.getCategoryName;
    this.menus = category.getMenuPreview;
    this.description = category.getCategoryDesc;
    this.state = category.getCategoryState;
    this.role = category.getCategoryRole;
  }
  name: string;
  menus: MenuPreviewInfo[];
  description: string;
  state: string;
  category_id: number;
  role: string;
}