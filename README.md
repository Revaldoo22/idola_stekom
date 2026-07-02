# Idola STEKOM — Voting FKP (Nest + Next)

Rewrite backend voting FKP: **NestJS API** (own DB + auth) + **Next.js admin dashboard** (TanStack Query).
DB belum final — TypeORM + Postgres dipakai sebagai default, gampang tuker nanti.

## Struktur

```
backend/                      NestJS + TypeORM (Postgres) + JWT
└─ src/
   ├─ main.ts                 bootstrap (prefix /api, CORS, validation pipe)
   ├─ app.module.ts           rakit semua module
   ├─ config/                 env → typed config (configuration.ts)
   ├─ database/
   │  ├─ database.module.ts   wiring TypeORM (ganti DB = sentuh file ini saja)
   │  └─ entities/            *.entity.ts + index.ts (daftar ENTITIES sekali)
   ├─ common/                 dipakai lintas module
   │  ├─ guards/              jwt.guard.ts, roles.guard.ts
   │  ├─ decorators/          @Roles(), @CurrentUser()
   │  └─ utils/               password.ts (scrypt)
   └─ modules/                SATU FOLDER PER FITUR
      ├─ auth/                controller + service + module + dto/
      ├─ admin/               /admin/stats
      └─ health/              /health

frontend/                     Next.js App Router + TanStack Query
└─ src/
   ├─ app/                    route TIPIS — cuma wiring layout/page
   │  ├─ login/  dashboard/   page.tsx import dari features/
   │  └─ providers.tsx        QueryClientProvider
   ├─ features/               SATU FOLDER PER FITUR
   │  ├─ auth/                api.ts + components/login-form.tsx
   │  └─ dashboard/           api.ts + hooks.ts + components/stats-cards.tsx
   └─ lib/
      ├─ api-client.ts        fetch wrapper + token storage
      └─ query-keys.ts        SEMUA query key terdaftar di sini
```

## Konvensi (wajib — biar kolab minim miss)

**Tambah fitur backend** (contoh: quests):
1. Entity baru → `database/entities/quest.entity.ts`, daftarkan di `entities/index.ts` (`ENTITIES`).
2. Folder `modules/quests/` → `quests.module.ts` + `quests.controller.ts` + `quests.service.ts` + `dto/`.
3. Proteksi: `@UseGuards(JwtGuard, RolesGuard)` + `@Roles("admin")` di controller.
4. Import module di `app.module.ts`. Selesai — tidak sentuh file fitur lain.

**Tambah fitur frontend**:
1. Folder `features/<fitur>/` → `api.ts` (fetch + types), `hooks.ts` (useQuery/useMutation), `components/`.
2. Query key daftar di `lib/query-keys.ts` — jangan hardcode string di komponen.
3. Route di `app/` cuma import komponen feature. Logic jangan di page.

**Aturan umum**: page/controller tipis, logic di service/hooks; types didefinisikan di `api.ts` feature (kontrak = response backend); jangan cross-import antar feature (lewat `lib/` kalau perlu shared).

## Jalankan (dev)

Butuh Postgres lokal (DB `idola_stekom`). Sesuaikan `backend/.env`.

```bash
# 1. Backend
cd backend
npm install
npm run start:dev          # http://localhost:4000/api  (DB_SYNC=true bikin tabel otomatis)

# 2. Seed data + admin (setelah API start sekali)
node scripts/seed.mjs      # login → identifier: Admin | password: admin123

# 3. Frontend
cd ../frontend
npm install
npm run dev                # http://localhost:3000  → /login → /dashboard
```

## Endpoint

| Method | Path              | Guard        | Fungsi                 |
|--------|-------------------|--------------|------------------------|
| GET    | `/api/health`     | —            | health check           |
| POST   | `/api/auth/login` | —            | login, keluarkan JWT   |
| GET    | `/api/auth/me`    | JWT          | identitas token        |
| GET    | `/api/admin/stats`| JWT + admin  | statistik dashboard    |

## Catatan

- `admin_stats()` RPC Supabase lama → `AdminService.stats()` (TypeORM). Voter = `distinct voter_phone` di `daily_votes` (model voter anonim).
- Password: scrypt (`salt:hash`), no dep eksternal. Tukar ke argon2/bcrypt saat produksi.
- `DB_SYNC=true` hanya dev — produksi pakai migration TypeORM.
- Endpoint admin lain (vote series, participants, quests, submissions, voters) belum dibuat — ikuti konvensi di atas.
