import { PartialType } from "@nestjs/mapped-types";
import { MenuCreateDto } from "./create-menu.dto";


export class MenuUpdateDto extends PartialType(MenuCreateDto) {//storeId를 수정불가능하게 할 것인지?
}