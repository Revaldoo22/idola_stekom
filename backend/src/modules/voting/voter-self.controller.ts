import { Controller, Get, UseGuards } from "@nestjs/common";
import { DataSource } from "typeorm";
import { JwtGuard, JwtPayload } from "../../common/guards/jwt.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

/** Riwayat hari ini untuk voter login: vote yang masuk + sisa kuota fav20. */
@Controller("voter")
@UseGuards(JwtGuard)
export class VoterSelfController {
  constructor(private readonly db: DataSource) {}

  @Get("today")
  async today(@CurrentUser() user: JwtPayload) {
    const rows = await this.db.query(
      `select dv.vote_kind, dv.points, dv.created_at,
              p.id as participant_id, p.name as participant_name
       from daily_votes dv
       join participants p on p.id = dv.participant_id
       join profiles pr on pr.phone_number = dv.voter_phone
       where pr.id = $1 and dv.vote_date = current_date
       order by dv.created_at desc`,
      [user.sub],
    );
    const favUsed = new Set(
      rows
        .filter((r: { vote_kind: string }) => r.vote_kind === "fav20")
        .map((r: { participant_id: string }) => r.participant_id),
    ).size;
    return { votes: rows, fav_quota: { used: favUsed, max: 10 } };
  }
}
