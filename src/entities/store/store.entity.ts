import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToOne, 
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
  
  @ManyToOne(type => User, user => user.getUser_id)
  user_id: User;
  
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
  get getCreated_at():Date {
    return this.created_at;
  }
  get getUpdated_at(): Date {
    return this.updated_at;
  }
  get getDeleted_at(): Date {
    return this.deleted_at;
  }

}