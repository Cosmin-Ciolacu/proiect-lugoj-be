import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
@Entity()
export class Problem extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: "category" }) category: string;
  @Column({ name: "sub_category" }) subCategory: string;
  @Column({ name: "lat", type: "double" }) lat: number;
  @Column({ name: "lng", type: "double" }) lng: number;
  @Column({ name: "image" }) image: string;
  @Column({ name: "observations", type: "text", nullable: true })
  observations: string;
  @Column({ name: "is_confirmed", default: false }) isConfirmed: boolean;
  @CreateDateColumn({ name: "created_at" }) createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" }) updatedAt: Date;
  @ManyToOne(() => User, (user) => user.problems)
  user: User;

  static async getProblems(
    skip: number = 0,
    take: number = 3
  ): Promise<Problem[]> {
    return await this.createQueryBuilder("problem")
      .leftJoinAndSelect("problem.user", "user")
      .offset(skip)
      .limit(take)
      .getMany();
  }
}
