import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School, Participant, Profile, DailyVote } from "../../database/entities";

export interface VoteSeriesPoint {
  day: string;
  votes: number;
}

export interface AdminStats {
  totalSchools: number;
  totalParticipants: number;
  totalVoters: number;
  totalVotes: number;
  totalPoints: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(School) private readonly schools: Repository<School>,
    @InjectRepository(Participant)
    private readonly participants: Repository<Participant>,
    @InjectRepository(Profile) private readonly profiles: Repository<Profile>,
    @InjectRepository(DailyVote)
    private readonly votes: Repository<DailyVote>,
  ) {}

  /** Mirrors the Supabase admin_stats() RPC. */
  async stats(): Promise<AdminStats> {
    const [totalSchools, totalParticipants, totalVotes] = await Promise.all([
      this.schools.count(),
      this.participants.count(),
      this.votes.count(),
    ]);

    // Distinct voters = distinct voter_phone on daily_votes (anonymous model).
    const voterRow = await this.votes
      .createQueryBuilder("dv")
      .select("COUNT(DISTINCT dv.voter_phone)", "c")
      .where("dv.voter_phone IS NOT NULL")
      .getRawOne<{ c: string }>();

    const pointsRow = await this.participants
      .createQueryBuilder("p")
      .select("COALESCE(SUM(p.total_points), 0)", "s")
      .getRawOne<{ s: string }>();

    return {
      totalSchools,
      totalParticipants,
      totalVoters: Number(voterRow?.c ?? 0),
      totalVotes,
      totalPoints: Number(pointsRow?.s ?? 0),
    };
  }

  /** Votes per day for the last `days` days — mirrors daily_vote_series(). */
  async voteSeries(days = 14): Promise<VoteSeriesPoint[]> {
    const clamped = Math.min(Math.max(days, 1), 90);
    const rows = await this.votes.query(
      `select to_char(d::date, 'YYYY-MM-DD') as day,
              coalesce((select count(*) from daily_votes dv
                        where dv.vote_date = d::date), 0)::int as votes
       from generate_series(current_date - ($1::int - 1), current_date, interval '1 day') d
       order by d`,
      [clamped],
    );
    return rows as VoteSeriesPoint[];
  }
}
