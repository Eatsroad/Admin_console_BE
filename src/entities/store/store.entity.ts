import { 
  Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn
} from "typeorm";
import { Menu } from "../menu/menu.entity";
import { User } from "../user/user.entity";

@Entity({name: "stores"})
export class Store {
  @PrimaryGeneratedColumn()
  private store_id: number;

  @Column({nullable: false})
  private name: string;

  @Column({nullable: false})
  private address: string;

  @Column({nullable: false})
  private phone_number: string;

  @Column({nullable : false})
  private user_id : string;

  @CreateDateColumn()
  private created_at: Date;

  @UpdateDateColumn()
  private updated_at: Date;

  @DeleteDateColumn()
  private deleted_at: Date;

  @Column({nullable : false})
  private tables: number;

  @Column({default: false})
  private is_approved: boolean;
  
  //@ManyToOne(type => User, user => user.getUser_id)
  //user_id: User;

  //@OneToMany(() => Menu, menu => menu.getMenuId)
  //menu_id: Menu[];
  get getUser_id():string{
    return this.user_id
  }

  get getStore_id(): number {
    return this.store_id;
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
  get getTables(): number{
    return this.tables;
  }
  get getCreated_at():Date {
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
  
  set setUserId(user_id : string){
    this.user_id = user_id;
  }

  set setName(name: string) {
    this.name = name;
  }
  set setAddress(address: string) {
    this.address = address;
  }
  set setPhone_number(phone_number: string) {
    this.phone_number = phone_number;
  }
  set setTables(tables: number){
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