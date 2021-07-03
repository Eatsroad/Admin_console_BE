import { Category } from "../../../../src/entities/category/category.entity";
import { Menu } from "../../../../src/entities/menu/menu.entity";

export class CategoryInfoResponseDto {
  constructor(category: Category) {
    this.category_id = category.getCategoryId;
    this.name = category.getCategoryName;
    this.menus = category.menus;
    this.description = category.getCategoryDesc;
    this.state = category.getCategoryState;
    this.role = category.getCategoryRole;
  }
  name: string;
  menus: Menu[];
  description: string;
  state: string;
  category_id: number;
  role: string;
}