import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TestModule } from './test/test.module';

@Module({
  imports: [TestModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
