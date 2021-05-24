import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BaseEntity,
} from "typeorm";

@Entity("votes")
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() userId: number;
  @Column() problemId: number;
  @Column() vote: string;
  @CreateDateColumn({ name: "created_at" }) createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" }) updatedAt: Date;
}
