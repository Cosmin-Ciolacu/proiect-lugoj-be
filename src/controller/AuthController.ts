import { JsonController, Post, Body, ContentType } from "routing-controllers";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { LoginBody } from "../../requestBody/LoginBody";
import { User } from "../entities";
import { RegisterBody } from "../../requestBody/RegisterBody";

@JsonController("/auth")
export class AuthController {
  @Post("/login")
  public async login(@Body() loginBody: LoginBody): Promise<any> {
    let response;
    const user: User = await User.findByEmail(loginBody.email);
    if (!user) {
      response = {
        success: true,
        userExists: false,
      };
      return response;
    }
    if (await compare(loginBody.password, user.password)) {
      const token: string = sign(
        Object.assign({}, user),
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );
      response = {
        success: true,
        token,
        invalidData: false,
        userExists: true,
        username: user.username,
        accountType: user.accountType,
      };
      return response;
    }
    response = {
      success: true,
      invalidData: true,
    };
    return response;
  }

  @Post("/register")
  public async register(@Body() registerBody: RegisterBody): Promise<any> {
    let response;
    if (await User.existsUser(registerBody.email)) {
      response = {
        success: true,
        userAlreadyExists: true,
      };
      return response;
    }
    const newUser = new User();
    if (!!registerBody.username) newUser.username = registerBody.username;
    if (!!registerBody.email) newUser.email = registerBody.email;
    if (!!registerBody.password)
      newUser.password = await hash(registerBody.password, 10);
    if (!!registerBody.accountType)
      newUser.accountType = registerBody.accountType;
    await newUser.save();
    response = {
      success: true,
      registered: true,
    };
    return response;
  }
}
