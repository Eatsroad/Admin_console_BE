import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { TableInheritance } from 'typeorm';
import { OptionCreateDto } from './dtos/create-option.dto';
import { OptionInfoResponseDto } from './dtos/option-info.dto';
import { OptionUpdateDto } from './dtos/update-option.dto';
import { OptionService } from './option.service';

@Controller('option')
export class OptionController {
    constructor(
        private readonly optionService : OptionService
    ) {}

    @Post()
    saveOption( @Body() dto:OptionCreateDto,): Promise<OptionInfoResponseDto>{
        return this.optionService.saveOption(dto);
    }

    @Get('/:option_id')
    getOptionInfo( @Param('option_id', ParseIntPipe) option_id:number):Promise<OptionInfoResponseDto>{
        return this.optionService.getOptionInfo(option_id);
    }

    @Put('/:opton_id')
    updateOptionInfo(
        @Param('option_id', ParseIntPipe) option_id:number,
        @Body() dto:OptionUpdateDto
    ): Promise<BasicMessageDto> {
        return this.optionService.updateOptionGroupInOption(option_id,dto);
    }

    @Patch('/:option_id/optiongroup')
    updateOptionGroupInMenu(
        @Param('option_id', ParseIntPipe) option_id: number,
        @Body() dto:OptionUpdateDto
    ): Promise<BasicMessageDto> {
        return this.optionService.updateOptionGroupInOption(option_id, dto);
    }

    @Delete('/:option_id')
    removeOption( @Param('option_id', ParseIntPipe) option_id: number) {
        return this.optionService.removeOption(option_id);
    }
}
