import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { request } from "express";
import { BasicMessageDto } from "src/common/dtos/basic-massage.dto";
import IStoreRequest from "src/interfaces/store-request";
import { StoreCreateDto } from "./dtos/create-store.dto";
import { StoreInfoResponseDto } from "./dtos/store-info-dto";
import { StoreUpdateDto } from "./dtos/update-store.dto";
import { StoreService } from "./store.service";

@Controller("/store")
@ApiTags("store API")
export class StoreController {
  constructor(private readonly StoreService: StoreService) {}

  @Post()
  @ApiOperation({
    summary: "스토어 생성 API",
    description: "스토어를 생성합니다",
  })
  @ApiResponse({
    description: "스토어를 생성합니다.",
    type: StoreInfoResponseDto,
  })
  saveStore(
    @Body() dto: StoreCreateDto,
    @Request() req: IStoreRequest
  ): Promise<StoreInfoResponseDto> {
    return this.StoreService.saveStore(dto, req);
  }

  @Get("/:storeId")
  @ApiOperation({
    summary: "스토어 정보 API",
    description: "요청된 스토어 id에 해당하는 스토어를 가져옵니다.",
  })
  @ApiResponse({
    description: "요청된 스토어 id에 해당하는 스토어를 가져옵니다.",
    type: StoreInfoResponseDto,
  })
  getStoreInfo(
    @Param("storeId", ParseIntPipe) storeid: number
  ): Promise<StoreInfoResponseDto> {
    return this.StoreService.getStoreInfo(storeid);
  }

  @Put("/:storeId")
  @ApiOperation({
    summary: "스토어 업데이트 API",
    description:
      "스토어 이름, 주소, 스토어 전화번호, 테이블 수를 업데이트합니다.",
  })
  @ApiResponse({
    description:
      "스토어 이름, 주소, 스토어 전화번호, 테이블 수를 업데이트합니다.",
    type: BasicMessageDto,
  })
  updateStoreInfo(
    @Param("storeId", ParseIntPipe) storeId: number,
    @Body() dto: StoreUpdateDto
  ): Promise<BasicMessageDto> {
    return this.StoreService.updateStoreInfo(storeId, dto);
  }

  @Delete("/:storeId")
  @ApiOperation({
    summary: "스토어 삭제 API",
    description: "스토어를 삭제합니다.",
  })
  @ApiResponse({
    description: "스토어를 삭제합니다.",
  })
  removeStore(@Param("storeId", ParseIntPipe) storeId: number) {
    return this.StoreService.removeStore(storeId);
  }
}
