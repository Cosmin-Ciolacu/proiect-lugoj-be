import {
  JsonController,
  Get,
  Post,
  Body,
  Authorized,
  CurrentUser,
  QueryParam,
} from "routing-controllers";
import { Problem, User } from "../entities";
import { ProblemBody } from "../requestBody/ProblemBody";

@JsonController("/main")
export class MainController {
  @Post("/add-problem")
  @Authorized()
  public async addProblem(
    @Body() problemBody: ProblemBody,
    @CurrentUser() user: User
  ): Promise<any> {
    const problem = new Problem();
    if (!!user) problem.user = user;
    if (!!problemBody.category) problem.category = problemBody.category;
    if (!!problemBody.subCategory)
      problem.subCategory = problemBody.subCategory;
    if (!!problemBody.lat) problem.lat = problemBody.lat;
    if (!!problemBody.lng) problem.lng = problemBody.lng;
    if (!!problemBody.image) problem.image = problemBody.image;
    if (!!problemBody.observations)
      problem.observations = problemBody.observations;
    await problem.save();
    return {
      success: 1,
      saved: 1,
    };
  }

  @Get("/problems")
  @Authorized()
  public async getProblems(
    @QueryParam("skip") skip?: number,
    @QueryParam("take") take?: number
  ): Promise<any> {
    if (skip === undefined && take === undefined) {
      const problems = await Problem.getProblems();
      return {
        success: 1,
        problems,
      };
    }
    const problems = await Problem.getProblems(skip, take);
    return {
      success: 1,
      problems,
    };
  }
}
