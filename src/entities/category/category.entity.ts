import { 
  Column,
  Entity, 
  JoinTable, 
  ManyToMany, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { Menu } from "../menu/menu.entity";

@Entity({name: "categories"})
export class Category {
  @PrimaryGeneratedColumn()
  private category_id: number;

  @Column({nullable: false})
  private name: string;

  @Column({nullable: true})
  private description: string;

  @Column({default: true})
  private state: string;

  get getCategoryId(): number {
    return this.category_id;
  }
  get getCategoryName(): string {
    return this.name;
  }
  get getCategoryDesc(): string {
    return this.description;
  }
  get getCategoryState(): string {
    return this.state;
  }

  set setCategoryName(name: string) {
    this.name = name;
  }
  set setCategoryDesc(description: string) {
    this.description = description;
  }
  set setCategoryState(state: string) {
    this.state = state;
  }
}
