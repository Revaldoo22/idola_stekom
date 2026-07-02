import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Profile } from "../../database/entities";
import { verifyPassword } from "../../common/utils/password";
import { normalizePhone } from "../../common/utils/normalize";
import { LoginDto } from "./dto/login.dto";

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
    private readonly jwt: JwtService,
  ) {}

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

    const token = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
      name: user.name ?? undefined,
    });

    return { token, redirect: roleHome(user.role), role: user.role };
  }
}
