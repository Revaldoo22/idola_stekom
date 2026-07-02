import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtGuard, JwtPayload } from "../../common/guards/jwt.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  /** Returns the current token's identity — used by the dashboard to bootstrap. */
  @Get("me")
  @UseGuards(JwtGuard)
  me(@CurrentUser() user: JwtPayload) {
    return { user };
  }
}
