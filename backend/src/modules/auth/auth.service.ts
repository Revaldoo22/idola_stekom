import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Not, Repository } from "typeorm";
import { Profile, School } from "../../database/entities";
import { hashPassword, verifyPassword } from "../../common/utils/password";
import { normalizePhone } from "../../common/utils/normalize";
import { LoginDto } from "./dto/login.dto";
import { OnboardingDto } from "./dto/onboarding.dto";
import type { GoogleUser } from "./google.service";

function roleHome(role: string): string {
  if (role === "admin") return "/admin";
  if (role === "participant") return "/participant/dashboard";
  return "/";
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile)
    private readonly profiles: Repository<Profile>,
    @InjectRepository(School)
    private readonly schools: Repository<School>,
    private readonly jwt: JwtService,
  ) {}

  private sign(user: Profile) {
    return this.jwt.signAsync({
      sub: user.id,
      role: user.role,
      name: user.name ?? undefined,
    });
  }

  /** Resolve identifier (phone or full name) → account, verify password. */
  async login(dto: LoginDto) {
    const raw = dto.identifier.trim();
    const looksLikePhone = /^[0-9+\-\s().]+$/.test(raw);

    let user: Profile | null = null;
    if (looksLikePhone) {
      user = await this.profiles.findOne({
        where: { phoneNumber: normalizePhone(raw) },
      });
    } else {
      const matches = await this.profiles.find({
        where: dto.expected_role
          ? { name: ILike(raw), role: dto.expected_role }
          : { name: ILike(raw) },
      });
      if (matches.length > 1) {
        throw new ConflictException(
          "Nama ini terdaftar lebih dari satu. Gunakan nomor WhatsApp.",
        );
      }
      user = matches[0] ?? null;
    }

    if (!user || !verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException("Nama/nomor atau password salah.");
    }

    if (dto.expected_role && user.role !== dto.expected_role) {
      throw new UnauthorizedException(
        dto.expected_role === "admin"
          ? "Akun ini bukan admin."
          : "Akun ini bukan peserta. Gunakan halaman login yang sesuai.",
      );
    }

    const token = await this.sign(user);
    return { token, redirect: roleHome(user.role), role: user.role };
  }

  /** Google SSO: find-or-create a voter account keyed by email. */
  async googleLogin(g: GoogleUser) {
    let user = await this.profiles.findOneBy({ email: g.email });
    if (!user) {
      user = await this.profiles.save(
        this.profiles.create({
          email: g.email,
          name: g.name,
          role: "voter",
          onboarded: false,
        }),
      );
    }
    const token = await this.sign(user);
    // Voters land on the wizard until they've completed it; other roles
    // (admin logging in with a Google-linked account) go to their home.
    const redirect =
      user.role === "voter" && !user.onboarded
        ? "/onboarding"
        : roleHome(user.role);
    return { token, redirect };
  }

  /** Profile snapshot for /auth/me (wizard prefill + guards). */
  async me(userId: string) {
    const user = await this.profiles.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException("Sesi tidak valid.");
    const school = user.schoolId
      ? await this.schools.findOneBy({ id: user.schoolId })
      : null;
    return {
      school: school?.name ?? null,
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phoneNumber,
      role: user.role,
      school_id: user.schoolId,
      class: user.voterClass,
      status: user.voterStatus,
      region: user.region,
      college_intent: user.collegeIntent,
      onboarded: user.onboarded,
    };
  }

  /** Complete the voter onboarding wizard. */
  async completeOnboarding(userId: string, dto: OnboardingDto) {
    const user = await this.profiles.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("Akun tidak ditemukan.");

    const phone = normalizePhone(dto.phone_number);
    const dupe = await this.profiles.findOne({
      where: { phoneNumber: phone, id: Not(userId) },
    });
    if (dupe) {
      throw new ConflictException("Nomor WhatsApp sudah dipakai akun lain.");
    }

    // School: pick existing or find-or-create by name (case-insensitive).
    let schoolId = dto.school_id ?? null;
    if (!schoolId && dto.school_name?.trim()) {
      const name = dto.school_name.trim();
      const existing = await this.schools
        .createQueryBuilder("s")
        .where("LOWER(s.name) = LOWER(:name)", { name })
        .getOne();
      schoolId = (existing ?? (await this.schools.save({ name }))).id;
    }

    user.name = dto.name.trim();
    user.passwordHash = hashPassword(dto.password);
    user.phoneNumber = phone;
    user.schoolId = schoolId;
    user.voterClass = dto.class;
    user.voterStatus = dto.status;
    user.region = dto.region.trim();
    user.collegeIntent = dto.college_intent;
    user.onboarded = true;
    await this.profiles.save(user);

    return { ok: true, redirect: "/" };
  }
}
