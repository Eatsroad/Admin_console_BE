import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Menu } from "./menu.entity";

@Entity({name: "enable_times"})
export class EnableTime {
  @PrimaryGeneratedColumn()
  private id: number;
  
  @CreateDateColumn({default:null})
  private start_time: Date;

  @CreateDateColumn({default:null})
  private end_time: Date;

  @Column({nullable: true})
  private description: string;

  @OneToOne(() => Menu, menu => menu.getMenuId)
  menu_id: Menu;

  get getEnableTimeId(): number {
    return this.id;
  }
  get getStartTime(): Date {
    return this.start_time;
  }
  get getEndTime(): Date {
    return this.end_time;
  }
  get getEnableTimeDesc(): string {
    return this.description;
  }

  set setStartTime(start_time: Date) {
    this.start_time = start_time;
  }
  set setEndTime(end_time: Date) {
    this.end_time = end_time;
  }
  set setEnableTimeDesc(description: string) {
    this.description = description;
  }
}