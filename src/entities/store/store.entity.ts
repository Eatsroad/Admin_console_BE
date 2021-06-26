import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn 
} from "typeorm";
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

  @CreateDateColumn()
  private created_at: Date;

  @CreateDateColumn()
  private updated_at: Date;

  @CreateDateColumn()
  private deleted_at: Date;

  @Column({nullable : false})
  private tables: number;

  @Column({default: false})
  private is_approved: boolean;
  
  @ManyToOne(() => User, user => user.stores)
  user: User;
  
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