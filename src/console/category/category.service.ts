import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entities/category/category.entity';
import { getRepository, Repository } from 'typeorm';
import { CategoryCreateDto } from './dto/create-categoty.dto';
import { CategoryInfoResponseDto } from './dto/category-info.dto';
import { BasicMessageDto } from '../../common/dtos/basic-massage.dto';
import { CategoryUpdatedto } from './dto/update-category.dto';
import { Menu } from '../../entities/menu/menu.entity';
import { CategoryMenuUpdateDto } from './dto/update-category-menus.dto';
import { Store } from '../../entities/store/store.entity';


@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) {}

  private convertMenuId2MenuObj = async (menuIdArr: number[]): Promise<Menu[]> => {
    const menu = getRepository(Menu);
    return await menu.findByIds(menuIdArr);
  }

  private categoryCreateDtoToEntity = async (dto: CategoryCreateDto): Promise<Category> => {
    const category = new Category();
    category.setCategoryName = dto.name;
    category.setCategoryDesc = dto.description;
    category.setCategoryState = dto.state;
    category.menus = await this.convertMenuId2MenuObj(dto.menus);
    category.setCategoryRole = dto.role;
    category.store = await getRepository(Store).findOne(dto.store_id);
    return category;
  }

  private isCategoryNameUnique = async (name: string): Promise<boolean> => {
    return (
      (await this.categoryRepository
        .createQueryBuilder()
        .select("categories")
        .from(Category, "categories")
        .where("categories.name = :name", {name})
        .getOne()) !== undefined
    );
  } 
  
  async saveCategory(dto: CategoryCreateDto): Promise<CategoryInfoResponseDto> {
    if (await this.isCategoryNameUnique(dto.name)) {
      throw new ConflictException("Category is already in use!");
    } else {
      const category = await this.categoryRepository.save(
        await this.categoryCreateDtoToEntity(dto)
      );
      
      return new CategoryInfoResponseDto(category);
    }
  }

  async getCategoryInfo(categoryId: number): Promise<CategoryInfoResponseDto> {
    const category = await this.categoryRepository.findOne(categoryId, {relations: ["menus"]});
    if (!!category) {
      return new CategoryInfoResponseDto(category);
    } else {
      throw new NotFoundException();
    }
  }
  
  async updateMenuInCategory(
    categoryId: number,
    dto: CategoryMenuUpdateDto
  ): Promise<BasicMessageDto> {
    const category = await this.categoryRepository.findOne(categoryId);
    category.menus = await this.convertMenuId2MenuObj(dto.menus);

    await this.categoryRepository.save(category);

    return new BasicMessageDto("Update menus");
  }

  async updateCategoryInfo(
    categoryId: number,
    dto: CategoryUpdatedto
  ): Promise<BasicMessageDto> {
    const result = await this.categoryRepository
      .createQueryBuilder()
      .update("categories", { ...dto })
      .where("category_id = :categoryId", { categoryId })
      .execute();

    if (result.affected !== 0) {
      return new BasicMessageDto("Updated Successfully.");
    } else throw new NotFoundException();
  };

  async removeCategory(categoryId: number): Promise<BasicMessageDto> {
    const result = await this.categoryRepository.delete(categoryId);
    if (result.affected !== 0) {
      return new BasicMessageDto("Deleted Successfully");
    } else throw new NotFoundException();
  }

  async getAllCategoryWithStoreId(storeId: number): Promise<CategoryInfoResponseDto[]> {
    const categories = await this.categoryRepository.find({
      where: { 
        store: storeId 
      }, 
      relations: ['menus'] 
    });
    return categories.map((category) => new CategoryInfoResponseDto(category));
  }
}
