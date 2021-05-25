import { Body, Controller, Post } from '@nestjs/common';
import { ConsoleService } from './console.service';
import { StoreCreateDto } from './dtos/create-store.dto';
import { StoreInfoResponseDto } from './dtos/store-info.dto';

@Controller('console')
export class ConsoleController {
    constructor(
        private readonly consoleService: ConsoleService){}

@Post()
saveStore(@Body() dto: StoreCreateDto): Promise<StoreInfoResponseDto>{
  return this.consoleService.saveStore(dto);
  }
}

/*

@Post()
saveStore(@Body() dto: StoreCreateDto): Promise<StoreInfoResponseDto> {
  return this.consoleService.saveUser(dto);
}
*/