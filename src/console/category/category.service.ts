import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entities/category/category.entity';
import { getRepository, Repository } from 'typeorm';
import { CategoryCreateDto } from './dto/create-categoty.dto';
import { CategoryInfoResponseDto } from './dto/category-info.dto';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { CategoryUpdatedto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) {}
  
  private categoryCreateDtoToEntity = (dto: CategoryCreateDto): Category => {
    const categoy = new Category();
    categoy.setCategoryName = dto.name;
    categoy.setCategoryDesc = dto.description;
    return categoy;
  }

  private isCategoryNameUnique = async (name: string): Promise<boolean> => {
    return (
      (await this.categoryRepository
        .createQueryBuilder()
        .select("category.category_id")
        .from(Category, "category")
        .where("category.name = :name", {name})
        .getOne()) !== undefined
    );
  } 
  
  async saveCategory(dto: CategoryCreateDto): Promise<CategoryInfoResponseDto> {
    if (await this.isCategoryNameUnique(dto.name)) {
      throw new ConflictException("Name is already in use!");
    } else {
      const category = await this.categoryRepository.save(
        this.categoryCreateDtoToEntity(dto)
      );
      return new CategoryInfoResponseDto(category);
    }
  }

  async getCategoryInfo(categoryId: number): Promise<CategoryInfoResponseDto> {
    const category = await this.categoryRepository.findOne(categoryId);
    if (!!category) {
      return new CategoryInfoResponseDto(category);
    } else {
      throw new NotFoundException();
    }
  }

  async updateCategoryInfo(
    categoryId: number,
    dto: CategoryUpdatedto
  ): Promise<BasicMessageDto> {
    const result = await this.categoryRepository
      .createQueryBuilder()
      .update("categories", {...dto})
      .where("category_id = :categoryId", {categoryId})
      .execute();
    if (result.affected !== 0) {
      return new BasicMessageDto("Updated Successfully.");
    } else throw new NotFoundException();
  }

  async removeCategory(categoryId: number): Promise<BasicMessageDto> {
    const result = await this.categoryRepository.delete(categoryId);
    if (result.affected !== 0) {
      return new BasicMessageDto("Deleted Successfully");
    } else throw new NotFoundException();
  }
}
