import { Category } from "src/entities/category/category.entity";

export class CategoryInfoResponseDto{
    constructor(category : Category){
        this.category_id = category.getCategory_id;
        this.name = category.getName;
        this.desc = category.getDesc;
        this.role = category.getRole;
        this.state= category.getState;
        
    }
    category_id: number;
    name: string;
    role: string;
    desc: string;
    state: boolean;
}