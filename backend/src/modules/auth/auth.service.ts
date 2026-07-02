import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Profile } from "../../database/entities";
import { verifyPassword } from "../../common/utils/password";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile)
    private readonly profiles: Repository<Profile>,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const id = dto.identifier.trim();
    // Match by phone or name; only accounts with a password (admin/participant).
    const user = await this.profiles.findOne({
      where: [{ phoneNumber: id }, { name: id }],
    });

    if (!user || !verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException("Kredensial salah");
    }

    const token = await this.jwt.signAsync({
      sub: user.id,
      role: user.role,
      name: user.name ?? undefined,
    });

    return {
      token,
      user: { id: user.id, name: user.name, role: user.role },
    };
  }
}
