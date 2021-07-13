import { MenuPreviewInfo } from "src/console/store/dtos/store-info-dto";
import { 
  Column,
  Entity, 
  JoinColumn, 
  JoinTable, 
  ManyToMany, 
  ManyToOne, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { Menu } from "../menu/menu.entity";
import { Store } from "../store/store.entity";

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

  @Column({nullable: true})
  private state: string;

  @ManyToMany(() => Menu)
  @JoinTable({
    name: "menus_and_categories",
    joinColumn: {
      name: "menu_id",
      referencedColumnName: "menu_id"
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "category_id"
    }
    },
  )
  menus: Menu[];

  @ManyToOne(() => Store, store => store.categories)
  @JoinColumn({name: "store_id"})
  store : Store;

  get getMenuPreview(): MenuPreviewInfo[] {
    let result: MenuPreviewInfo[] = [];
    try {
      this.menus.forEach((menu) => {
        const data: MenuPreviewInfo = {
          name: menu.getMenuName,
          menu_id: menu.getMenuId
        };
        result.push(data);
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  }
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