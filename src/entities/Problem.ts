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
  @Column({ default: "VERIFYING" }) status: string;
  @Column({ name: "is_resolved", default: false }) isResolved: boolean;
  @CreateDateColumn({ name: "created_at" }) createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" }) updatedAt: Date;
  @ManyToOne(() => User, (user) => user.problems)
  user: User;
  /* static async count(): Promise<number> {
    return this.count();
  } */

  static async getProblems(
    skip: number = 0,
    take: number = 3,
    category: string = null,
    userId: number = null,
    status: string = ""
  ): Promise<Problem[]> {
    if (userId) {
      return await this.createQueryBuilder("problem")
        .where("problem.userId = :userId", { userId })
        .andWhere("problem.status = :status", { status })
        .leftJoinAndSelect("problem.user", "user")
        .orderBy("problem.updatedAt", "DESC")
        .offset(skip)
        .limit(take)
        .getMany();
    }
    if (category !== null) {
      console.log("filter by category");
      return await this.createQueryBuilder("problem")
        .where("problem.category = :category", { category })
        .leftJoinAndSelect("problem.user", "user")
        .orderBy("problem.updatedAt", "DESC")
        .offset(skip)
        .limit(take)
        .getMany();
    }
    return await this.createQueryBuilder("problem")
      .leftJoinAndSelect("problem.user", "user")
      .orderBy("problem.updatedAt", "DESC")
      .offset(skip)
      .limit(take)
      .getMany();
  }

  static async getLocations(): Promise<Problem[]> {
    return await this.createQueryBuilder("problem")
      //.select(["problem.lat", "problem.lng", "problem.category"])
      .leftJoinAndSelect("problem.user", "user")
      .getMany();
  }
  static async getNumber(category: string): Promise<number> {
    return await this.createQueryBuilder("problem")
      .where("problem.category = :category", { category })
      .getCount();
  }
}
