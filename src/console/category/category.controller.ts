import { Controller } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('category')
@ApiTags('category API')
export class CategoryController {}
