import { PartialType } from "@nestjs/mapped-types";
import { MenuCreateDto } from "./create-menu.dto";


export class MenuUpdateDto extends PartialType(MenuCreateDto) {
}