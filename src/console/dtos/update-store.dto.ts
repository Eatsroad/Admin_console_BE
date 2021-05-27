import { PartialType } from "@nestjs/mapped-types";
import { StoreCreateDto } from "./create-store.dto";

export class StoreUpdateDto extends PartialType(StoreCreateDto)
{}



/*export class UserUpdateDto extends PartialType(
    OmitType(UserCreateDto, ["email"] as const)
  ) {}
  */