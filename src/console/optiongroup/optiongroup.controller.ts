import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Request, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { TransactionInterceptor } from 'src/interceptor/transaction.interceptor';
import IStoreRequest from 'src/interfaces/store-request';
import { MenuUpdateDto } from '../menu/dtos/update-menu.dto';
import { OptionGroupCreateDto } from './dtos/create-optiongroup.dto';
import { OptionGroupInfoResponseDto } from './dtos/optiongroup-info.dto';
import { OptionGroupUpdateDto } from './dtos/update-optiongroup.dto';
import { OptiongroupService } from './optiongroup.service';

@Controller('optiongroup')
export class OptiongroupController {
    constructor(
        private readonly optiongroupService : OptiongroupService,
    ) {}

    @Post()
    @ApiOperation({
        summary:'옵션 그룹 생성 API',
        description: '옵션 그룹을 생성합니다.'
    })
    @ApiResponse({
        description: '옵션 그룹을 생성합니다.',
        type: OptionGroupInfoResponseDto
    })
    @UseInterceptors(TransactionInterceptor)
    saveOptionGroup(
        @Body() dto: OptionGroupCreateDto, @Request() req: IStoreRequest,
    ): Promise<OptionGroupInfoResponseDto>{
        return this.optiongroupService.saveOptionGroup(dto, req.storeId);
    }

    @Get('/:option_group_id')
    @ApiOperation({
        summary:'옵션 그룹 정보 API',
        description: '요청된 옵션그룹id에 해당하는 옵션그룹 전체를 가져옵니다.'
    })
    @ApiResponse({
        description: '요청된 옵션그룹id에 해당하는 옵션그룹 전체를 가져옵니다.',
        type: OptionGroupInfoResponseDto
    })
    getOptiongroupInfo(@Param('option_group_id', ParseIntPipe) option_group_id: number): Promise<OptionGroupInfoResponseDto>{
        return this.optiongroupService.getOptiongroupInfo(option_group_id);
    }

    @Get()
    @ApiOperation({
        summary:'옵션 그룹 전체 정보 API',
        description: '요청된 가게id에 해당하는 옵션그룹 전체를 가져옵니다.'
    })
    @ApiResponse({
        description: '요청된 가게id에 해당하는 옵션그룹 전체를 가져옵니다.',
        type: OptionGroupInfoResponseDto
    })
    getAllOptionGroupList(@Request() req : IStoreRequest): Promise<OptionGroupInfoResponseDto[]>{
        return this.optiongroupService.getAllOptionGroupList(req.storeId);
    }

    @Delete('/:option_group_id')
    @ApiOperation({
        summary:'옵션 그룹 삭제 API',
        description: '요청된 옵션그룹id에 해당하는 옵션그룹을 삭제합니다.'
    })
    @ApiResponse({
        description: '요청된 옵션그룹id에 해당하는 옵션그룹을 삭제합니다.',
        type: OptionGroupInfoResponseDto
    })
    removeOptiongroup( @Param('option_group_id', ParseIntPipe) option_group_id : number){
        return this.optiongroupService.removeOptiongroup(option_group_id);
    }

    @Put('/:option_group_id')
    @ApiOperation({
        summary:'옵션 그룹 수정 API',
        description: '요청된 옵션그룹id에 해당하는 옵션그룹을(이름,설명,상태) 수정합니다.'
    })
    @ApiResponse({
        description: '요청된 옵션그룹id에 해당하는 옵션그룹을(이름,설명,상태) 수정합니다.',
        type: OptionGroupInfoResponseDto
    })
    @UseInterceptors(TransactionInterceptor)
    updateOptiongroupInfo(
        @Param('option_group_id', ParseIntPipe) option_group_id: number,
        @Body() dto: OptionGroupUpdateDto,
        @Request() req:IStoreRequest
    ):Promise<BasicMessageDto>{
        return this.optiongroupService.updateOptiongroupInfo(option_group_id, dto, req.storeId);
    }


    @Patch('/:option_group_id/option')
    @ApiOperation({
        summary:'옵션 그룹의 옵션 수정 API',
        description: '요청된 옵션그룹id에 해당하는 옵션그룹의 옵션만을 수정합니다.'
    })
    @ApiResponse({
        description: '요청된 옵션그룹id에 해당하는 옵션그룹의 옵션만을 수정합니다.',
        type: BasicMessageDto
    })
    @UseInterceptors(TransactionInterceptor)
    updateOptionInOptionGroup(
        @Param('option_group_id', ParseIntPipe) option_group_id: number,
        @Body() dto: OptionGroupUpdateDto,
    ):Promise<BasicMessageDto>{
        return this.optiongroupService.updateOptionInOptionGroup(option_group_id,dto);
    }

    @Patch('/:option_group_id/menu')
    @ApiOperation({
        summary:'옵션 그룹의 메뉴 수정 API',
        description: '요청된 옵션그룹id에 해당하는 옵션그룹의 메뉴정보만을 수정합니다.'
    })
    @ApiResponse({
        description: '요청된 옵션그룹id에 해당하는 옵션그룹의 메뉴정보만을 수정합니다.',
        type: BasicMessageDto
    })
    @UseInterceptors(TransactionInterceptor)
    updateMenuInOptionGroup(
        @Param('option_group_id', ParseIntPipe) option_group_id: number,
        @Body() dto: OptionGroupUpdateDto,
    ):Promise<BasicMessageDto>{
        return this.optiongroupService.updateMenuInOptionGroup(option_group_id,dto);
    }


}

