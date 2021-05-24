import {
  JsonController,
  Get,
  Post,
  Body,
  Authorized,
  CurrentUser,
  QueryParam,
} from "routing-controllers";
import { Problem, User, Vote } from "../entities";
import { ProblemBody } from "../requestBody/ProblemBody";
import { VoteBody } from "../requestBody/VoteBody";

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
  @Post("/vote")
  @Authorized()
  public async vote(
    @CurrentUser() user: User,
    @Body() voteBody: VoteBody
  ): Promise<any> {
    const isVoted = await Vote.findOne({
      where: {
        userId: user.id,
        problemId: voteBody.problemId,
      },
    });
    if (isVoted) {
      return {
        success: 1,
        voted: 1,
      };
    }
    const vote = new Vote();
    if (!!user.id) vote.userId = user.id;
    if (!!voteBody.problemId) vote.problemId = voteBody.problemId;
    if (!!voteBody.vote) vote.vote = voteBody.vote;
    await vote.save();
    return {
      success: 1,
      saved: 1,
    };
  }
}
