import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clampInt,
  filledSlowEnough,
  notHoneypot,
  zodFieldErrors,
} from "../src/lib/formsecurity.ts";

test("honeypot: empty string passes, filled value fails", () => {
  assert.equal(notHoneypot({ company: "" }), true);
  assert.equal(notHoneypot({ company: "spambot" }), false);
  assert.equal(notHoneypot({}), false);
});

test("min fill time: too fast fails, slow enough passes", () => {
  const now = Date.now();
  assert.equal(filledSlowEnough(now), false);
  assert.equal(filledSlowEnough(now - 60_000), true);
  assert.equal(filledSlowEnough(Number.NaN), false);
});

test("clampInt keeps ints inside bounds", () => {
  assert.equal(clampInt(9.9, 1, 5), 5);
  assert.equal(clampInt(0, 1, 5), 1);
  assert.equal(clampInt("3", 1, 5), 3);
  assert.equal(clampInt(undefined, 1, 5), 1);
});

test("zodFieldErrors maps first field path", () => {
  const out = zodFieldErrors({
    issues: [
      { path: ["name"], message: "too short" },
      { path: [0], message: "ignored" },
    ],
  });
  assert.deepEqual(out, { name: "too short" });
});
