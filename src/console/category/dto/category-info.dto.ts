import { IsBoolean, IsEnum, IsNumber, IsString } from "class-validator";
import { CategoryRole } from "src/entities/category/category.entity";

export class CategoryCreateDto{
    @IsNumber()
    category_id: number;
    @IsString()
    name: string;
    @IsString()
    desc: string;
    @IsBoolean()
    state: boolean;
    @IsEnum(CategoryRole)
    role : CategoryRole;
}