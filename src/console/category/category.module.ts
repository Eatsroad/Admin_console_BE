import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category/category.entity';
import { Menu } from 'src/entities/menu/menu.entity';
import { Store } from 'src/entities/store/store.entity';
import { User } from 'src/entities/user/user.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Menu, Store, User])],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
