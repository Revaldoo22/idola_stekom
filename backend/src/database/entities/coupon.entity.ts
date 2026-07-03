import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

/** Kupon undian (hadiah handphone). Didapat sekali dari follow saat vote. */
@Entity("coupons")
@Index("coupon_uniq_source", ["profileId", "source"], { unique: true })
export class Coupon {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", unique: true })
  code!: string;

  @Column({ name: "profile_id", type: "uuid" })
  profileId!: string;

  @Column({ type: "text", default: "follow" })
  source!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
