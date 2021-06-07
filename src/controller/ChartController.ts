import {
  JsonController,
  Get,
  Post,
  Body,
  Authorized,
  CurrentUser,
  QueryParam,
  Param,
  Put,
} from "routing-controllers";
import { createQueryBuilder } from "typeorm";
import { Problem, User, Vote } from "../entities";
import { ProblemsNumbersBody } from "../requestBody/ProblemsNumbersBody";

@JsonController("/chart")
export class ChartController {
  @Post("/problems-numbers")
  @Authorized()
  public async getProblemsNumbers(
    @Body() problemsNumbersBody: ProblemsNumbersBody
  ): Promise<any> {
    const data = await Promise.all(
      problemsNumbersBody.categories.map(async (category) => {
        return {
          category,
          nr: await Problem.getNumber(category),
        };
      })
    );
    console.log(data);
    return {
      success: 1,
      data,
    };
  }

  @Get("/problems-percentages")
  @Authorized()
  public async getProblemsPercentages(
    @QueryParam("category") category: string
  ): Promise<any> {
    console.log(category);
    if (category !== "ALL") {
      const total = await createQueryBuilder(Problem, "problem")
        .where("problem.category = :category", { category })
        .getCount();
      const problemsResolved = await createQueryBuilder(Problem, "problem")
        .where("problem.status = :status", { status: "DONE" })
        .andWhere("problem.category = :category", { category })
        .getCount();
      const problemsInProgres = await createQueryBuilder(Problem, "problem")
        .where("problem.status = :status", { status: "IN_PROGRESS" })
        .andWhere("problem.category = :category", { category })
        .getCount();
      const problemsinVerfying =
        100 - ((problemsResolved + problemsInProgres) / total) * 100;
      console.log("castegory", category);
      console.log("resolved", problemsResolved);
      console.log("progress", problemsInProgres);
      console.log("verify", problemsinVerfying);
      return {
        success: 1,

        resolved: (problemsResolved / total) * 100,
        inProgres: (problemsInProgres / total) * 100,
        verifying: problemsinVerfying,
      };
    }
    //const total = await Problem.count();
    const total = await Problem.count();
    const problemsinVerfying = await createQueryBuilder(Problem, "problem")
      .where("problem.status = :status", { status: "VERIFYING" })
      .getCount();
    const problemsResolved = await createQueryBuilder(Problem, "problem")
      .where("problem.status = :status", { status: "DONE" })
      .getCount();
    const problemsInProgres = await createQueryBuilder(Problem, "problem")
      .where("problem.status = :status", { status: "IN_PROGRESS" })
      .getCount();

    /* return {
      success: 1,
      resolved: problemsResolved,
      inProgres: problemsInProgres,
      verifying: problemsinVerfying,
    }; */

    return {
      success: 1,

      resolved: (problemsResolved / total) * 100,
      inProgres: (problemsInProgres / total) * 100,
      verifying: 100 - ((problemsResolved + problemsInProgres) / total) * 100,
    };
  }
}
