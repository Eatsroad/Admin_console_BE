import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/entities/category/category.entity";
import { Repository } from "typeorm";
import { MenuboardCategoryResponseDto } from "./dtos/menuboard-info.dto";

@Injectable()
export class MenuboardService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async getCategoryByStoreId(
    storeId: number
  ): Promise<MenuboardCategoryResponseDto[]> {
    const categories = await this.categoryRepository.find({
      where: {
        store: storeId,
      },
      //relations: ["menus"],
    });
    return categories.map(
      (category) => new MenuboardCategoryResponseDto(category)
    );
  }
}
