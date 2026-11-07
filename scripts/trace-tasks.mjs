// Deeper: for each top RunTask, aggregate child events by name.
import fs from "node:fs";

const raw = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const events = Array.isArray(raw) ? raw : raw.traceEvents;

// thread names
const names = {};
for (const e of events) {
  if (e.name === "thread_name" || e.name === "ThreadName") {
    names[`${e.pid}/${e.tid}`] = e.args?.name ?? e.args?.data?.name ?? "?";
  }
}
console.log("threads:", JSON.stringify(names));

const tasks = events
  .filter((e) => e.name === "RunTask" && e.ph === "X" && e.dur > 100_000)
  .sort((a, b) => b.dur - a.dur)
  .slice(0, 8);

const all = events.filter((e) => e.ph === "X" && e.name !== "RunTask");

for (const t of tasks) {
  const end = t.ts + t.dur;
  const kids = all.filter((c) => c.pid === t.pid && c.tid === t.tid && c.ts >= t.ts && c.ts + c.dur <= end);
  const agg = {};
  for (const k of kids) {
    const key = k.name + (k.args?.data?.url ? " " + String(k.args.data.url).replace("http://localhost:3000", "").slice(0, 60) : "");
    agg[key] = (agg[key] ?? 0) + k.dur;
  }
  const top = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([k, v]) => `${k}=${((v / 1000) | 0)}ms`).join(", ");
  console.log(`\ntask ${((t.dur / 1000) | 0)}ms @${((t.ts / 1000) | 0)}ms thread=${names[`${t.pid}/${t.tid}`] ?? t.tid} (pid ${t.pid})`);
  console.log("   children:", top || "NONE");
  // sample every child event name for debugging if none
  if (!top && kids.length) console.log("   raw kids:", kids.slice(0, 5).map((k) => `${k.name}:${(k.dur / 1000) | 0}ms`).join(", "));
}
