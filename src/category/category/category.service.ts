import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { Category } from 'src/entities/category/category.entity';
import { Repository } from 'typeorm';
import { CategoryCreateDto } from './dto/category-info.dto';
import { CategoryInfoResponseDto } from './dto/create-category.dto';
import { CategoryUpdateDto } from './dto/update-menu.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
    ) {}

    private categoryCreateDtoToEntity = (dto: CategoryCreateDto): Category => {
        const category = new Category();
        category.setName = dto.name;
        category.setCategory_id = dto.category_id;
        category.setDesc = dto.desc;
        category.setRole = dto.role;
        category.setState = dto.state;
        
        return category;
      }
    
      async saveCategory(dto: CategoryCreateDto): Promise<CategoryInfoResponseDto> {
         const category = await this.categoryRepository.save(
            this.categoryCreateDtoToEntity(dto)
          );
          return new CategoryInfoResponseDto(category);
        
      }
    
      async getCategorynfo(categoryId: number): Promise<CategoryInfoResponseDto> {
        const category = await this.categoryRepository.findOne(categoryId);
        if (!!category) {
          return new CategoryInfoResponseDto(category);
        } else {
          throw new NotFoundException();
        }
      }
      
      async updateCategoryInfo(
        categoryId: number,
        dto: CategoryUpdateDto
      ): Promise<BasicMessageDto> {
        const result = await this.categoryRepository
          .createQueryBuilder()
          .update("categories", { ...dto })//update해라
          .where("category_id = :categoryId", { categoryId })//menuId=menuId인 위치에서
          .execute();
        if (result.affected !== 0) {
          return new BasicMessageDto("Updated Successfully.");
        } else throw new NotFoundException();
      }
      
      async removeMenu(categoryId: number): Promise<BasicMessageDto> {
        const result = await this.categoryRepository.delete(categoryId);
        if (result.affected !== 0) {
          return new BasicMessageDto("Deleted Successfully.");
        } else throw new NotFoundException();
      }
  //

      
  
  
}