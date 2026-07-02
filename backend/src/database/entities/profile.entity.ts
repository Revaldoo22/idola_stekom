import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export type Role = "admin" | "participant" | "voter";

/**
 * Auth account. Admin & participant log in with phone + password.
 * `voter` rows may exist from the legacy model; current voters are anonymous
 * and stored inline on daily_votes, so voter stats count distinct phones there.
 */
@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: true })
  name!: string | null;

  @Column({ name: "phone_number", type: "text", unique: true, nullable: true })
  phoneNumber!: string | null;

  @Column({ name: "password_hash", type: "text", nullable: true })
  passwordHash!: string | null;

  @Column({ type: "text", default: "voter" })
  role!: Role;

  @Column({ name: "school_id", type: "uuid", nullable: true })
  schoolId!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
