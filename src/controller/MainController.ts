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
import { Problem, User, Vote } from "../entities";
import { ProblemBody } from "../requestBody/ProblemBody";
import { VoteBody } from "../requestBody/VoteBody";
import { Mailer } from "../utils/Mailer";

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
    @CurrentUser() user: User,
    @QueryParam("skip") skip?: number,
    @QueryParam("take") take?: number,
    @QueryParam("userProblems") userProblems?: boolean,
    @QueryParam("status") status?: string,
    @QueryParam("category") category?: string
  ): Promise<any> {
    console.log(category);
    if (skip === undefined && take === undefined) {
      const problems = await Problem.getProblems();
      return {
        success: 1,
        problems,
      };
    }
    if (userProblems) {
      const problems = await Problem.getProblems(
        skip,
        take,
        null,
        user.id,
        status
      );
      return {
        success: 1,
        problems,
      };
    }
    if (category) {
      const problems = await Problem.getProblems(skip, take, category);
      console.log(problems);
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
    const positiveVotes = await Vote.getPositiveVotes(voteBody.problemId);
    const negativeVotes = await Vote.getNegativeVotes(voteBody.problemId);
    const isResolved =
      Math.floor(positiveVotes / negativeVotes) > 2 ? true : false;
    if (isResolved) {
      const problem = await Problem.findOne(voteBody.problemId);
      problem.isResolved = true;
      await problem.save();
      //send mail
    }
    return {
      success: 1,
      saved: 1,
      isResolved,
    };
  }

  @Get("/locations")
  @Authorized()
  public async getLocations() {
    const locations = await Problem.getLocations();
    console.log(locations);
    return {
      success: 1,
      locations,
    };
  }

  @Get("/is-voted/:problemId")
  @Authorized()
  public async isVoded(
    @CurrentUser() user: User,
    @Param("problemId") problemId: number
  ): Promise<any> {
    const isProblemVoted = await Vote.isProblemVoted(user.id, problemId);
    const positiveVotes = await Vote.getPositiveVotes(problemId);
    const negativeVotes = await Vote.getNegativeVotes(problemId);
    return {
      success: 1,
      isProblemVoted,
      positiveVotes,
      negativeVotes,
    };
  }

  @Put("/update-status/:problemId/:status")
  @Authorized()
  public async markResolved(
    @Param("problemId") problemId: number,
    @Param("status") status: string
  ): Promise<any> {
    const problem = await Problem.findOne(problemId);
    //problem.isResolved = true;
    console.log(problem);
    problem.status = status;
    //const reporter = await User.findOne(problem.user.id);
    const email = problem.user.email;
    await problem.save();

    //const email = problem.user.email;
    const mailer = new Mailer();
    const data = await mailer.sendMail(
      email,
      "schimbare status",
      `Sesizarea cu id-ul ${problemId} are statusul ${status}`
    );
    return {
      success: 1,
      updated: 1,
    };
  }
}
