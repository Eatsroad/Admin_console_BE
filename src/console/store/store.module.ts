import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/store/store.entity';
import { StoreAuthMiddleware } from 'src/middlewares/store-auth.middleware';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [StoreService],
  controllers: [StoreController]
})

export class StoreModule {
  configure(consumer : MiddlewareConsumer){
    consumer
    .apply(StoreAuthMiddleware)
    .forRoutes(StoreController);
  }
}
