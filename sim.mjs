// Simulasi aturan pemilihan hadiah, meniru urutan langkah di spin().
const P = (o) => ({
  weight: 0, isEmpty: false, isGuaranteed: false, isLocked: false,
  active: true, stock: null, winnerQuota: null, maxPerAccount: null,
  autoAtPoints: null, autoAtSpins: null, ...o,
});

const prizes = [
  P({ code: "hp_baru", label: "HP Baru", active: false, isLocked: true }),
  P({ code: "kunci_1", label: "1 Kunci", isGuaranteed: true, winnerQuota: 41, maxPerAccount: 1 }),
  P({ code: "tumbler", label: "Tumbler", weight: 1, winnerQuota: 8, maxPerAccount: 1, autoAtPoints: 100, autoAtSpins: 10 }),
  P({ code: "kaos_eksklusif", label: "Kaos", weight: 1, winnerQuota: 6, maxPerAccount: 1 }),
  P({ code: "zonk", label: "Dash", weight: 598, isEmpty: true }),
];

const winners = new Map();
const owned = (e, c) => (winners.get(c)?.has(e) ? 1 : 0);
const winnerCount = (c) => winners.get(c)?.size ?? 0;
const available = (p) => (p.isLocked ? false : p.active && (p.stock === null || p.stock > 0));
const claimable = (p, e) => {
  if (!available(p)) return false;
  if (p.maxPerAccount !== null && owned(e, p.code) >= p.maxPerAccount) return false;
  if (p.winnerQuota !== null && !owned(e, p.code) && winnerCount(p.code) >= p.winnerQuota) return false;
  return true;
};
const give = (p, e) => {
  if (!winners.has(p.code)) winners.set(p.code, new Set());
  winners.get(p.code).add(e);
  return p.code;
};

function spin({ email, spinNo, points, forcedCode, forcedMin, keyTarget }) {
  const forced = forcedCode ? prizes.find((p) => p.code === forcedCode && !p.isLocked) ?? null : null;
  const min = Math.max(0, forcedMin ?? 0);
  if (forced && spinNo >= min && claimable(forced, email)) return give(forced, email);
  if (keyTarget !== null && spinNo === keyTarget) {
    const k = prizes.find((p) => p.isGuaranteed);
    if (k && claimable(k, email)) return give(k, email);
  }
  if (!forced) {
    for (const p of prizes) {
      if (p.autoAtPoints === null && p.autoAtSpins === null) continue;
      const reached = (p.autoAtPoints !== null && points >= p.autoAtPoints) ||
                      (p.autoAtSpins !== null && spinNo >= p.autoAtSpins);
      if (reached && claimable(p, email)) return give(p, email);
    }
    return "acak";
  }
  return "zonk";
}

const F = { forcedCode: "tumbler", forcedMin: 10, keyTarget: null, points: 0 };

console.log("== T1: grand prize terkunci, dipaksa sekalipun ==");
console.log("hasil:", spin({ email: "a@x", spinNo: 1, points: 0, forcedCode: "hp_baru", forcedMin: 0, keyTarget: null }));

console.log("");
console.log("== T2: satu akun, spin 1..12, tumbler dipaksa mulai ke-10 ==");
winners.clear();
const o1 = [];
for (let n = 1; n <= 12; n++) o1.push(`${n}:${spin({ ...F, email: "b@x", spinNo: n })}`);
console.log(o1.join(" "));

console.log("");
console.log("== T3: 12 akun, semua di spin ke-10, jatah tumbler 8 ==");
winners.clear();
const r1 = [];
for (let i = 1; i <= 12; i++) r1.push(spin({ ...F, email: `u${i}@x`, spinNo: 10 }));
console.log("dapat tumbler:", r1.filter((r) => r === "tumbler").length, "/ 12");

console.log("");
console.log("== T4: jatah tumbler dilepas (null), 12 akun di spin ke-10 ==");
winners.clear();
prizes.find((p) => p.code === "tumbler").winnerQuota = null;
const r2 = [];
for (let i = 1; i <= 12; i++) r2.push(spin({ ...F, email: `v${i}@x`, spinNo: 10 }));
console.log("dapat tumbler:", r2.filter((r) => r === "tumbler").length, "/ 12");

console.log("");
console.log("== T5: satu akun spin ke-10 lalu ke-11, maxPerAccount 1 ==");
winners.clear();
console.log("spin 10:", spin({ ...F, email: "w@x", spinNo: 10 }));
console.log("spin 11:", spin({ ...F, email: "w@x", spinNo: 11 }));

console.log("");
console.log("== T6: mode paksa OFF, grand prize salah setel autoAtSpins=1 ==");
winners.clear();
prizes.find((p) => p.code === "hp_baru").autoAtSpins = 1;
console.log("spin ke-5, poin 999:", spin({ email: "z@x", spinNo: 5, points: 999, forcedCode: null, forcedMin: 0, keyTarget: null }));
console.log("hp_baru bocor?", (winners.get("hp_baru")?.size ?? 0) > 0 ? "YA - BOCOR" : "tidak, tetap terkunci");
