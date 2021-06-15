import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConsoleModule } from './console/console.module';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, ConsoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
