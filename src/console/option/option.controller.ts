import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Request, RequestMapping, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { TransactionInterceptor } from 'src/interceptor/transaction.interceptor';
import IStoreRequest from 'src/interfaces/store-request';
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
    @ApiOperation({
        summary:'옵션 생성 API',
        description: '옵션을 생성합니다.'
    })
    @ApiResponse({
        description: '옵션을 생성합니다.',
        type: OptionInfoResponseDto
    })
    @UseInterceptors(TransactionInterceptor)
    saveOption( @Body() dto:OptionCreateDto, @Request() req: IStoreRequest): Promise<OptionInfoResponseDto>{
        return this.optionService.saveOption(dto, req.storeId);
    }

    @Get('/:option_id')
    @ApiOperation({
        summary:'옵션 정보 API',
        description: '요청된 옵션id에 해당하는 옵션 전체를 가져옵니다.'
    })
    @ApiResponse({
        description: '요청된 옵션id에 해당하는 옵션 전체를 가져옵니다.',
        type: OptionInfoResponseDto
    })
    getOptionInfo( @Param('option_id', ParseIntPipe) option_id:number):Promise<OptionInfoResponseDto>{
        return this.optionService.getOptionInfo(option_id);
    }

    @Get()
    @ApiOperation({
        summary:'옵션 전체 정보 API',
        description: '요청된 가게id에 해당하는 옵션 전체를 가져옵니다.'
    })
    @ApiResponse({
        description: '요청된 가게id에 해당하는 옵션 전체를 가져옵니다.',
        type: OptionInfoResponseDto
    })
    getAllOptionList( @Request() req:IStoreRequest):Promise<OptionInfoResponseDto[]>{
        return this.optionService.getAllOptionList(req.storeId);
    }

    @Put('/:option_id')
    @ApiOperation({
        summary:'옵션 업데이트 API',
        description: '요청된 옵션id에 해당하는 옵션을(이름,가격,상태) 업데이트합니다.'
    })
    @ApiResponse({
        description: '요청된 옵션id에 해당하는 옵션을(이름,가격,상태) 업데이트합니다.',
        type: BasicMessageDto
    })
    @UseInterceptors(TransactionInterceptor)
    updateOptionInfo(
        @Param('option_id', ParseIntPipe) option_id:number,
        @Body() dto:OptionUpdateDto,
        @Request() req:IStoreRequest
    ): Promise<BasicMessageDto> {
        return this.optionService.updateOptionInfo(option_id, dto, req.storeId);
    }

    @Patch('/:option_id/optiongroup')
    @ApiOperation({
        summary:'옵션의 옵션그룹 업데이트 API',
        description: '요청된 옵션id에 해당하는 옵션의 옵션그룹만을 업데이트합니다.'
    })
    @ApiResponse({
        description: '요청된 옵션id에 해당하는 옵션의 옵션그룹만을 업데이트합니다.',
        type: BasicMessageDto
    })
    @UseInterceptors(TransactionInterceptor)
    updateOptionGroupInMenu(
        @Param('option_id', ParseIntPipe) option_id: number,
        @Body() dto:OptionUpdateDto
    ): Promise<BasicMessageDto> {
        return this.optionService.updateOptionGroupInOption(option_id, dto);
    }

    @Delete('/:option_id')
    @ApiOperation({
        summary:'옵션 삭제 API',
        description: '요청된 옵션id에 해당하는 옵션을 삭제합니다.'
    })
    @ApiResponse({
        description: '요청된 옵션id에 해당하는 옵션을 삭제합니다.'
    
    })
    removeOption( @Param('option_id', ParseIntPipe) option_id: number) {
        return this.optionService.removeOption(option_id);
    }
}
