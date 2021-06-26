import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '../../../src/entities/menu/menu.entity';
import { UserAuthMiddleware } from '../../../src/middlewares/user-auth.middleare';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
    imports:[TypeOrmModule.forFeature([Menu])],
    controllers: [MenuController],
    providers: [MenuService],
})
export class MenuModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .forRoutes(MenuController);
  }
}
