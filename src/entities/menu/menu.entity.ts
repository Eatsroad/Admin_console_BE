import { CategoryPreviewInfo } from "src/console/category/dto/category-info.dto";
import { OptionGroupPreviewInfo } from "src/console/optiongroup/dtos/optiongroup-info.dto";
import { 
  Column,
  Entity, 
  JoinColumn, 
  JoinTable, 
  ManyToMany, 
  ManyToOne, 
  OneToOne, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { Category } from "../category/category.entity";
import { OptionGroup } from "../option/optionGroup.entity";
import { Store } from "../store/store.entity";
import { EnableTime } from "./enableTime.entity";

@Entity({name: "menus"})
export class Menu {
  @PrimaryGeneratedColumn()
  private menu_id: number;

  @Column({nullable: false})
  private name: string;

  @Column({nullable: false})
  private price: number;

  @Column({nullable: true})
  private description: string;

  @Column({nullable: true})
  private state: string;

  @ManyToOne(() => Store, store => store.menus)
  @JoinColumn({name: "store_id"})
  store_id : Store;

  @OneToOne(() => EnableTime, enableTime => enableTime.menu_id)
  @JoinColumn({name: "enable_time"})
  enable_time: EnableTime;

  @ManyToMany(() => Category,)
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
  categories: Category[];

  @ManyToMany(() => OptionGroup, optiongroup => optiongroup.menus)
  @JoinTable({
    name: "menus_and_option_groups",
    joinColumn: {
      name: "menu_id",
      referencedColumnName: "menu_id"
    },
    inverseJoinColumn: {
      name: "option_group_id",
      referencedColumnName: "option_group_id"
    }
   },
  )
  optionGroups: OptionGroup[];

  get getMenuId(): number {
    return this.menu_id;
  }

  get getMenuName(): string {
    return this.name;
  }

  get getMenuPrice(): number {
    return this.price;
  }

  get getMenuDesc(): string {
    return this.description;
  }

  get getMenuState(): string {
    return this.state;
  }

  get getCategoryPreviewInfo(): CategoryPreviewInfo[] {
    let result: CategoryPreviewInfo[] = [];
    try {
      this.categories.forEach((category) => {
        const data = {
          name: category.getCategoryName,
          category_id: category.getCategoryId
        };
        result.push(data);
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  get getOptionGroupsPreviewInfo(): OptionGroupPreviewInfo[] {
    let result: OptionGroupPreviewInfo[] = [];
    try {
      this.optionGroups.forEach((optiongroups) => {
        const data = {
          name: optiongroups.getOptionGroupName,
          option_group_id: optiongroups.getOptionGroupId
        };
        result.push(data);
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  }
  

  set setMenuName(name: string) {
    this.name = name;
  }

  set setMenuPrice(price: number) {
    this.price = price;
  }

  set setMenuDesc(description: string) {
    this.description = description;
  }

  set setMenuState(state: string) {
    this.state = state;
  }

  
}
