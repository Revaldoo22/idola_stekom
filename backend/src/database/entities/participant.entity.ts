import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export type ParticipantStatus = "active" | "inactive";

@Entity("participants")
export class Participant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ name: "school_id", type: "uuid", nullable: true })
  schoolId!: string | null;

  @Column({ name: "phone_number", type: "text", nullable: true })
  phoneNumber!: string | null;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "total_points", type: "int", default: 0 })
  totalPoints!: number;

  @Column({ type: "text", default: "active" })
  status!: ParticipantStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
