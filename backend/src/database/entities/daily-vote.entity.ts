import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export type VoteKind = "daily5" | "fav20";

@Entity("daily_votes")
export class DailyVote {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "participant_id", type: "uuid" })
  participantId!: string;

  @Column({ name: "vote_date", type: "date", default: () => "CURRENT_DATE" })
  voteDate!: string;

  @Column({ name: "vote_kind", type: "text", default: "daily5" })
  voteKind!: VoteKind;

  @Column({ type: "int", default: 5 })
  points!: number;

  @Column({ name: "voter_phone", type: "text", nullable: true })
  voterPhone!: string | null;

  @Column({ name: "voter_name", type: "text", nullable: true })
  voterName!: string | null;

  @Column({ name: "voter_email", type: "text", nullable: true })
  voterEmail!: string | null;

  @Column({ name: "device_fingerprint", type: "text", nullable: true })
  deviceFingerprint!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
