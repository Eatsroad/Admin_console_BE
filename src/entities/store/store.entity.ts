import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "../category/category.entity";
import { Menu } from "../menu/menu.entity";
import { Option } from "../option/option.entity";
import { OptionGroup } from "../option/optionGroup.entity";
import { User } from "../user/user.entity";

@Entity({ name: "stores" })
export class Store {
  @PrimaryGeneratedColumn()
  private store_id: number;

  @Column({ nullable: false })
  private name: string;

  @Column({ nullable: false })
  private address: string;

  @Column({ nullable: false })
  private phone_number: string;

  @CreateDateColumn()
  private created_at: Date;

  @UpdateDateColumn({ default: null })
  private updated_at: Date;

  @DeleteDateColumn({ default: null })
  private deleted_at: Date;

  @Column({ nullable: true })
  private tables: number;

  @Column({ default: false })
  private is_approved: boolean;

  @ManyToOne((type) => User, (user) => user.getUser_id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Menu, (menu) => menu.store_id)
  menus: Menu[];

  @OneToMany(() => Category, (category) => category.store)
  categories: Category[];

  @OneToMany(() => OptionGroup, (optiongroup) => optiongroup.store)
  optionGroups: OptionGroup[];

  @OneToMany(() => Option, (option) => option.store)
  options: Option[];

  get getStore_id(): number {
    return this.store_id;
  }

  get getEncodedStore_id(): string {
    return Buffer.from(String(this.store_id), "binary").toString("base64");
  }

  get getName(): string {
    return this.name;
  }
  get getAddress(): string {
    return this.address;
  }
  get getPhone_number(): string {
    return this.phone_number;
  }
  get getTables(): number {
    return this.tables;
  }
  get getCreated_at(): Date {
    return this.created_at;
  }
  get getUpdated_at(): Date {
    return this.updated_at;
  }
  get getDeleted_at(): Date {
    return this.deleted_at;
  }
  get getIsApproved(): boolean {
    return this.is_approved;
  }
  // get getMenus(): MenuPreviewInfo[] {
  //   let result: MenuPreviewInfo[] = [];
  //   this.menus.forEach((menu) => {
  //     const data: MenuPreviewInfo = {
  //       menu_id: menu.getMenuId,
  //     };

  //     result.push(data);
  //   });
  //   return result;
  // }

  set setName(name: string) {
    this.name = name;
  }
  set setAddress(address: string) {
    this.address = address;
  }
  set setPhone_number(phone_number: string) {
    this.phone_number = phone_number;
  }
  set setTables(tables: number) {
    this.tables = tables;
  }
  set setDeletedAt(deleted_at: Date) {
    this.deleted_at = deleted_at;
  }
  set setUpdatedAt(updated_at: Date) {
    this.updated_at = updated_at;
  }
  set setIsApproved(is_approved: boolean) {
    this.is_approved = is_approved;
  }
}
