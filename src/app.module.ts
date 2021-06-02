import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from './menu/menu/menu.module';
import { UserModule } from './user/user.module';

import { UserService } from './user/user.service';
import { MenuService } from './menu/menu/menu.service';
import { CategoryModule } from './category/category/category.module';
import { CategoryService } from './category/category/category.service';
import { Category } from './entities/category/category.entity';
import { CategoryController } from './category/category/category.controller';
import { MenuController } from './menu/menu/menu.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, MenuModule, CategoryModule],//typeormmodule.forroot()=nestjs어플리케이션이 시작될때 db설정파일을 확인하고 커넥션을 열어주느 작업을 수행하는 부분
  controllers: [CategoryController, MenuController, UserController],
  providers: [CategoryService, UserService, MenuService,],
})
export class AppModule {

}
