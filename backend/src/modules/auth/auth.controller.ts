import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { GoogleService } from "./google.service";
import { LoginDto } from "./dto/login.dto";
import { OnboardingDto } from "./dto/onboarding.dto";
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
  constructor(
    private readonly auth: AuthService,
    private readonly google: GoogleService,
  ) {}

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

  /** Voter SSO: redirect the browser to Google's consent screen. */
  @Get("google")
  googleStart(@Res() res: Response) {
    res.redirect(this.google.authUrl());
  }

  /** Google redirects here; set the session cookie then bounce to the app. */
  @Get("google/callback")
  async googleCallback(
    @Query("code") code: string,
    @Query("error") error: string,
    @Res() res: Response,
  ) {
    if (error || !code) return res.redirect("/login?sso=failed");
    try {
      const gUser = await this.google.exchange(code);
      const { token, redirect } = await this.auth.googleLogin(gUser);
      res.cookie(AUTH_COOKIE, token, COOKIE_OPTS);
      return res.redirect(redirect);
    } catch {
      return res.redirect("/login?sso=failed");
    }
  }

  /** Voter onboarding wizard submit. */
  @Post("onboarding")
  @UseGuards(JwtGuard)
  onboarding(@CurrentUser() user: JwtPayload, @Body() dto: OnboardingDto) {
    return this.auth.completeOnboarding(user.sub, dto);
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIE, { path: "/" });
    return { ok: true };
  }

  /** Current identity + profile snapshot (wizard prefill, guards). */
  @Get("me")
  @UseGuards(JwtGuard)
  async me(@CurrentUser() user: JwtPayload) {
    return { user: await this.auth.me(user.sub) };
  }
}
