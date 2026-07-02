import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { AUTH_COOKIE, JwtGuard, JwtPayload } from "../../common/guards/jwt.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /** Same contract as the old app: { ok, redirect } + httpOnly session cookie. */
  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, redirect } = await this.auth.login(dto);
    res.cookie(AUTH_COOKIE, token, COOKIE_OPTS);
    return { ok: true, redirect };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIE, { path: "/" });
    return { ok: true };
  }

  /** Current token identity — used by the frontend to bootstrap. */
  @Get("me")
  @UseGuards(JwtGuard)
  me(@CurrentUser() user: JwtPayload) {
    return { user };
  }
}
