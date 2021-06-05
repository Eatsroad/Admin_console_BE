import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entities/store/store.entity';
import { UserModule } from 'src/user/user.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [StoreService],
  controllers: [StoreController]
})

export class StoreModule {}
