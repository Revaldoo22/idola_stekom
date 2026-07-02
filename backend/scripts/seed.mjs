// Dev seed: creates schema-independent sample data + one admin account.
// Run AFTER the API has started once with DB_SYNC=true (tables exist).
//   node scripts/seed.mjs
import "dotenv/config";
import pg from "pg";
import { randomBytes, scryptSync } from "crypto";

function hashPassword(plain) {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

const client = new pg.Client({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "idola_stekom",
});

await client.connect();

const school = await client.query(
  `insert into schools (name) values ($1) returning id`,
  ["SMA Contoh 1"],
);
const schoolId = school.rows[0].id;

await client.query(
  `insert into participants (name, school_id, total_points, status)
   values ($1,$2,$3,'active'), ($4,$2,$5,'active')`,
  ["Peserta A", schoolId, 120, "Peserta B", 85],
);

const adminPw = "admin123";
await client.query(
  `insert into profiles (name, phone_number, password_hash, role, school_id)
   values ($1,$2,$3,'admin',$4)
   on conflict (phone_number) do update set password_hash = excluded.password_hash`,
  ["Admin", "0800000000", hashPassword(adminPw), schoolId],
);

await client.query(
  `insert into daily_votes (participant_id, vote_kind, points, voter_phone, voter_name)
   select id, 'daily5', 5, '081111', 'Voter Satu' from participants limit 1`,
);

await client.end();
console.log(`Seeded. Admin login → identifier: Admin | password: ${adminPw}`);
