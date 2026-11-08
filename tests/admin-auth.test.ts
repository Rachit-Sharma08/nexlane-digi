import assert from "node:assert/strict";
import { test } from "node:test";
import { 
  sessionKey, 
  signSession, 
  verifySessionCookie, 
  hashPassword, 
  timingSafeEqualHex,
  getSessionKeyFromEnv 
} from "../src/lib/admin-auth.ts";

test("sessionKey produces deterministic SHA-256 hex", async () => {
  const key1 = await sessionKey("test-password");
  const key2 = await sessionKey("test-password");
  assert.equal(key1, key2);
  assert.equal(key1.length, 64);
});

test("signSession creates valid cookie format", async () => {
  const key = await sessionKey("secret");
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const cookie = await signSession(exp, key);
  const [expPart, sigPart] = cookie.split('.');
  assert.equal(expPart, exp.toString());
  assert.equal(sigPart.length, 64);
});

test("verifySessionCookie accepts valid cookie", async () => {
  const key = await sessionKey("secret");
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const cookie = await signSession(exp, key);
  const valid = await verifySessionCookie(cookie, key);
  assert.equal(valid, true);
});

test("verifySessionCookie rejects tampered signature", async () => {
  const key = await sessionKey("secret");
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const cookie = await signSession(exp, key);
  const [expPart, sigPart] = cookie.split('.');
  const tampered = `${expPart}.${sigPart.slice(0, -1)}f`;
  const valid = await verifySessionCookie(tampered, key);
  assert.equal(valid, false);
});

test("verifySessionCookie rejects expired cookie", async () => {
  const key = await sessionKey("secret");
  const exp = Math.floor(Date.now() / 1000) - 3600; // expired 1 hour ago
  const cookie = await signSession(exp, key);
  const valid = await verifySessionCookie(cookie, key);
  assert.equal(valid, false);
});

test("verifySessionCookie rejects cookie signed with different key", async () => {
  const key1 = await sessionKey("secret1");
  const key2 = await sessionKey("secret2");
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const cookie = await signSession(exp, key1);
  const valid = await verifySessionCookie(cookie, key2);
  assert.equal(valid, false);
});

test("hashPassword produces deterministic SHA-256 hex", async () => {
  const hash1 = await hashPassword("test-password");
  const hash2 = await hashPassword("test-password");
  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64);
});

test("timingSafeEqualHex returns true for identical strings", () => {
  assert.equal(timingSafeEqualHex("abc", "abc"), true);
  assert.equal(timingSafeEqualHex("000000", "000000"), true);
});

test("timingSafeEqualHex returns false for different strings", () => {
  assert.equal(timingSafeEqualHex("abc", "abd"), false);
  assert.equal(timingSafeEqualHex("000000", "000001"), false);
});

test("timingSafeEqualHex returns false for different lengths", () => {
  assert.equal(timingSafeEqualHex("abc", "abcd"), false);
  assert.equal(timingSafeEqualHex("a", "aa"), false);
});

test("getSessionKeyFromEnv returns null when ADMIN_PASSWORD unset", async () => {
  delete process.env.ADMIN_PASSWORD;
  const key = await getSessionKeyFromEnv();
  assert.equal(key, null);
});

test("getSessionKeyFromEnv returns session key when ADMIN_PASSWORD set", async () => {
  process.env.ADMIN_PASSWORD = "test-password";
  const key = await getSessionKeyFromEnv();
  assert.notEqual(key, null);
  assert.equal(key!.length, 64);
  delete process.env.ADMIN_PASSWORD;
});

test("validatePost rejects bad slug", async () => {
  const { validatePost } = await import("../src/lib/admin-validate.ts");
  const result = validatePost({
    slug: "invalid_slug",
    title: "Test",
    description: "Test description",
    category: "Test",
    date: "2026-11-08",
    author: "Rachit Sharma",
    draft: true,
    content: [{ type: "p", text: "Test content" }]
  });
  assert.equal(result.ok, false);
  assert.ok(result.error.includes("slug"));
});

test("validatePost rejects oversized text", async () => {
  const { validatePost } = await import("../src/lib/admin-validate.ts");
  const longText = "a".repeat(5001);
  const result = validatePost({
    slug: "valid-slug",
    title: "Test",
    description: "Test description",
    category: "Test",
    date: "2026-11-08",
    author: "Rachit Sharma",
    draft: true,
    content: [{ type: "p", text: longText }]
  });
  assert.equal(result.ok, false);
  assert.ok(result.error.includes("5000"));
});

test("validatePost rejects unknown author", async () => {
  const { validatePost } = await import("../src/lib/admin-validate.ts");
  const result = validatePost({
    slug: "valid-slug",
    title: "Test",
    description: "Test description",
    category: "Test",
    date: "2026-11-08",
    author: "Unknown Person",
    draft: true,
    content: [{ type: "p", text: "Test content" }]
  });
  assert.equal(result.ok, false);
  assert.ok(result.error.includes("author"));
});

test("validatePost accepts good post", async () => {
  const { validatePost } = await import("../src/lib/admin-validate.ts");
  const result = validatePost({
    slug: "valid-slug",
    title: "Test Post",
    description: "Test description",
    category: "Test Category",
    date: "2026-11-08",
    author: "Rachit Sharma",
    draft: true,
    content: [{ type: "p", text: "Test content" }]
  });
  assert.equal(result.ok, true);
  assert.equal(result.post.slug, "valid-slug");
});