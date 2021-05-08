import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(readonly testSerivce: TestService) {}

  @Get()
  getTest(): any {
    return this.testSerivce.getTest()
  }
}
