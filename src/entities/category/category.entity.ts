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

  @Column({nullable: true})
  private name: string;

  @Column({nullable: true})
  private description: string;

  @Column({nullable: true})
  private role: string;

  @Column({default: true})
  private state: string;

  @ManyToMany(() => Menu)
  @JoinTable({
    name: "menus_and_categories",
    joinColumn: {
      name: "category_id",
      referencedColumnName: "category_id"
    },
    inverseJoinColumn: {
      name: "menu_id",
      referencedColumnName: "menu_id"
    }
  })
  menus: Menu[];
  
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
  get getCategoryRole(): string {
    return this.role;
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
  set setCategoryRole(role: string) {
    this.role = role;
  }

}