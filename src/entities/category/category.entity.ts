import { 
  Column,
  Entity, 
  JoinTable, 
  ManyToMany, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { Menu } from "../menu/menu.entity";

export enum CategoryRole {
  BiG = "big",
  SMALL = "small",
  ETC = "etc"
};

@Entity({name: "categories"})
export class Category {
  @PrimaryGeneratedColumn()
  private category_id: number;

  @Column({nullable: false})
  private name: string;

  @Column({nullable: true})
  private description: string;

  @Column({
    type: "enum",
    enum: CategoryRole,
    default: CategoryRole.ETC
  })
  private role: string;

  @Column({default: true})
  private state: boolean;

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
  get getCategoryState(): boolean {
    return this.state;
  }
  get getCategoryRole(): string {
    return this.getCategoryRole;
  }

  set setCategoryName(name: string) {
    this.name = name;
  }
  set setCategoryDesc(description: string) {
    this.description = description;
  }
  set setCategoryState(state: boolean) {
    this.state = state;
  }
  set setCategoryRole(role: string) {
    this.role = role;
  }

}