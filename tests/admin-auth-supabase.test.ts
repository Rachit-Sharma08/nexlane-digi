import assert from "node:assert/strict";
import { test, before, after, describe } from "node:test";

// Mock environment variables for testing
const originalEnv = { ...process.env };

before(() => {
  process.env.ADMIN_EMAIL_1 = "test-admin-1@example.com";
  process.env.ADMIN_EMAIL_2 = "test-admin-2@example.com";
  process.env.ADMIN_ROUTE_SLUG = "panel-test";
});

after(() => {
  // Restore original env
  for (const key of Object.keys(process.env)) {
    delete process.env[key];
  }
  for (const [key, value] of Object.entries(originalEnv)) {
    process.env[key] = value;
  }
});

// Helper to run test with modified env
function withEnv(env: Record<string, string>, fn: () => void) {
  const saved: Record<string, string | undefined> = {};
  for (const key of Object.keys(env)) {
    saved[key] = process.env[key];
    process.env[key] = env[key];
  }
  try {
    fn();
  } finally {
    for (const key of Object.keys(env)) {
      if (saved[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = saved[key]!;
      }
    }
  }
}

// Import after setting env
const { 
  isAllowedAdminEmail,
  getAdminRouteSlug,
  isAdminLoginPath,
  isAdminPath,
  getAdminLoginUrl,
  getAdminDashboardUrl,
  validateAdminRouteConfig,
  isValidAdminRouteSlug,
} = await import("../src/lib/admin-auth-utils.ts");

describe("admin-auth-utils", () => {
  test("isAllowedAdminEmail returns true for allowed emails", () => {
    assert.equal(isAllowedAdminEmail("test-admin-1@example.com"), true);
    assert.equal(isAllowedAdminEmail("test-admin-2@example.com"), true);
    assert.equal(isAllowedAdminEmail("TEST-ADMIN-1@EXAMPLE.COM"), true); // case insensitive
  });

  test("isAllowedAdminEmail returns false for non-allowed emails", () => {
    assert.equal(isAllowedAdminEmail("hacker@example.com"), false);
    assert.equal(isAllowedAdminEmail(""), false);
  });

  test("requires exactly two distinct configured admin emails", () => {
    withEnv({ ADMIN_EMAIL_2: "test-admin-1@example.com" }, () => {
      assert.equal(isAllowedAdminEmail("test-admin-1@example.com"), false);
    });
    withEnv({ ADMIN_EMAIL_2: "" }, () => {
      assert.equal(isAllowedAdminEmail("test-admin-1@example.com"), false);
    });
  });

  test("getAdminRouteSlug returns configured slug", () => {
    assert.equal(getAdminRouteSlug(), "/panel-test");
  });

  test("isAdminLoginPath matches login path", () => {
    assert.equal(isAdminLoginPath("/panel-test/login"), true);
    assert.equal(isAdminLoginPath("/panel-test/login/"), true);
    assert.equal(isAdminLoginPath("/panel-test"), false);
    assert.equal(isAdminLoginPath("/admin/login"), false);
  });

  test("isAdminPath matches admin paths", () => {
    assert.equal(isAdminPath("/panel-test"), true);
    assert.equal(isAdminPath("/panel-test/"), true);
    assert.equal(isAdminPath("/panel-test/posts"), true);
    assert.equal(isAdminPath("/panel-test/posts/new"), true);
    assert.equal(isAdminPath("/panel-test-evil"), false);
    assert.equal(isAdminPath("/admin"), false);
    assert.equal(isAdminPath("/"), false);
  });

  test("getAdminLoginUrl returns correct URL", () => {
    assert.equal(getAdminLoginUrl(), "/panel-test/login");
  });

  test("getAdminDashboardUrl returns correct URL", () => {
    assert.equal(getAdminDashboardUrl(), "/panel-test");
  });
});

describe("getAdminRouteSlug production behavior", () => {
  test("returns dev fallback in development when not set", () => {
    withEnv({ NODE_ENV: "development" }, () => {
      delete process.env.ADMIN_ROUTE_SLUG;
      
      const slug = getAdminRouteSlug();
      assert.equal(slug, "/panel-x7f");
    });
  });

  test("returns dev fallback in production when not set (runtime enforcement in proxy)", () => {
    withEnv({ NODE_ENV: "production" }, () => {
      delete process.env.ADMIN_ROUTE_SLUG;
      
      const slug = getAdminRouteSlug();
      assert.equal(slug, "/panel-x7f");
      assert.equal(validateAdminRouteConfig().valid, false);
    });
  });

  test("accepts an explicitly configured fallback-looking slug", () => {
    withEnv({ ADMIN_ROUTE_SLUG: "panel-x7f" }, () => {
      assert.equal(validateAdminRouteConfig().valid, true);
      assert.equal(getAdminRouteSlug(), "/panel-x7f");
    });
  });

  test("rejects an invalid route slug at runtime", () => {
    withEnv({ ADMIN_ROUTE_SLUG: "../admin" }, () => {
      assert.equal(validateAdminRouteConfig().valid, false);
    });
  });

  test("rejects slugs that would shadow public site routes", () => {
    assert.equal(isValidAdminRouteSlug("contact"), false);
    assert.equal(isValidAdminRouteSlug("services"), false);
    assert.equal(isValidAdminRouteSlug("panel-x7f"), true);
  });

  test("validates slug format", () => {
    withEnv({ ADMIN_ROUTE_SLUG: "../bad" }, () => {
      try {
        getAdminRouteSlug();
        assert.fail("Should have thrown");
      } catch (err: unknown) {
        assert.ok(err instanceof Error);
        assert.ok(err.message.includes("must be one path segment"));
      }
    });
  });
});
