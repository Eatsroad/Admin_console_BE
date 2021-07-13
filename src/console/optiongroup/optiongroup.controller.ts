import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BasicMessageDto } from 'src/common/dtos/basic-massage.dto';
import { MenuUpdateDto } from '../menu/dtos/update-menu.dto';
import { OptionGroupCreateDto } from './dtos/create-optiongroup.dto';
import { OptionGroupInfoResponseDto } from './dtos/optiongroup-info.dto';
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
    saveOptionGroup(
        @Body() dto: OptionGroupCreateDto,
    ): Promise<OptionGroupInfoResponseDto>{
        return this.optiongroupService.saveOptionGroup(dto);
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
    updateOptiongroupInfo(
        @Param('option_group_id', ParseIntPipe) option_group_id: number,
        @Body() dto: MenuUpdateDto,
    ):Promise<BasicMessageDto>{
        return this.optiongroupService.updateOptiongroupInfo(option_group_id,dto);
    }


    @Patch('/:option_group_id/option')
    @ApiOperation({
        summary:'옵션 그룹 수정 API',
        description: '요청된 옵션그룹id에 해당하는 옵션그룹의 옵션만을 수정합니다.'
    })
    @ApiResponse({
        description: '요청된 옵션그룹id에 해당하는 옵션그룹의 옵션만을 수정합니다.',
        type: BasicMessageDto
    })
    updateOptionInOptionGroup(
        @Param('option_group_id', ParseIntPipe) option_group_id: number,
        @Body() dto: MenuUpdateDto,
    ):Promise<BasicMessageDto>{
        return this.optiongroupService.updateOptionInOptionGroup(option_group_id,dto);
    }

}

