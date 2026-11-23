"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminRoute } from "../AdminRouteContext";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  draft: boolean;
  content: unknown[];
};

type AdminAccount = {
  id: string;
  email: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

type LoginAttempt = {
  id: string;
  email: string;
  attempted_at: string;
  success: boolean;
  ip: string | null;
  user_agent: string | null;
  locked_out: boolean;
};

export default function AdminDashboard() {
  const router = useRouter();
  const adminRoute = useAdminRoute();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [error, setError] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "accounts" | "security">("posts");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (res.ok) {
        const loginUrl = `${adminRoute}/login`;
        router.push(loginUrl);
        router.refresh();
      }
    } catch {
      const loginUrl = `${adminRoute}/login`;
      router.push(loginUrl);
      router.refresh();
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;

    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/posts/${slug}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (res.status === 401) {
        const loginUrl = `${adminRoute}/login`;
        router.push(loginUrl);
        router.refresh();
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete post");
      }

      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setDeletingSlug(null);
    }
  };

  const loadPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/posts", {
        credentials: "same-origin",
      });

      if (res.status === 401) {
        const loginUrl = `${adminRoute}/login`;
        router.push(loginUrl);
        router.refresh();
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load posts");
      }

      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [router, adminRoute]);

  const loadAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    try {
      const res = await fetch("/api/admin/accounts", {
        credentials: "same-origin",
      });
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch {
      // Ignore errors for accounts loading
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  const loadAttempts = useCallback(async () => {
    setLoadingAttempts(true);
    try {
      const res = await fetch("/api/admin/login-attempts?limit=50", {
        credentials: "same-origin",
      });
      if (res.ok) {
        const data = await res.json();
        setAttempts(data.attempts || []);
      }
    } catch {
      // Ignore errors for attempts loading
    } finally {
      setLoadingAttempts(false);
    }
  }, []);

  const toggleAccountActive = async (email: string, isActive: boolean) => {
    if (!confirm(`Are you sure you want to ${isActive ? 'enable' : 'disable'} this account?`)) return;
    
    try {
      const res = await fetch("/api/admin/accounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, is_active: isActive }),
      });
      if (res.ok) {
        loadAccounts();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update account");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  const clearLockout = async (email: string) => {
    if (!confirm("Clear lockout for this account?")) return;
    
    try {
      const res = await fetch("/api/admin/login-attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        loadAttempts();
        loadAccounts(); // Refresh accounts to update lockout status
      } else {
        const data = await res.json();
        alert(data.error || "Failed to clear lockout");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.new.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess("Password changed successfully");
        setPasswordForm({ current: "", new: "", confirm: "" });
      } else {
        setPasswordError(data.error || "Failed to change password");
      }
    } catch {
      setPasswordError("Network error. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      await loadPosts();
      await loadAccounts();
      await loadAttempts();
      if (!cancelled) setLoading(false);
    };
    loadData();
    return () => { cancelled = true; };
  }, [router, loadPosts, loadAccounts, loadAttempts]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="text-center text-[var(--muted)]">Loading…</div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[var(--text)]">Nexlane admin</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Changes save to blog.json and go live on the next deploy.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`${adminRoute}/posts/new`} className="btn btn-primary">
              New post
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost">
              Log out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass p-1 rounded-lg inline-flex" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "posts"}
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "posts"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Posts
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "accounts"}
            onClick={() => setActiveTab("accounts")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "accounts"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Accounts
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "security"}
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "security"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            Security
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="p-4 rounded-lg bg-[rgba(239,68,68,0.15)] border border-[rgb(239,68,68)] text-[rgb(239,68,68)] text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="glass overflow-hidden">
            {posts.length === 0 ? (
              <div className="p-12 text-center text-[var(--muted)]">
                No posts yet. <Link href={`${adminRoute}/posts/new`} className="text-[var(--accent-2)] hover:underline">
                  Create one
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" role="grid">
                  <thead>
                    <tr className="border-b border-[var(--card-border)]">
                      <th className="text-left p-4 font-medium text-[var(--muted)] text-sm">Title</th>
                      <th className="text-left p-4 font-medium text-[var(--muted)] text-sm hidden md:table-cell">Slug</th>
                      <th className="text-left p-4 font-medium text-[var(--muted)] text-sm hidden lg:table-cell">Category</th>
                      <th className="text-left p-4 font-medium text-[var(--muted)] text-sm">Date</th>
                      <th className="text-left p-4 font-medium text-[var(--muted)] text-sm">Status</th>
                      <th className="text-right p-4 font-medium text-[var(--muted)] text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.slug} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--secondary)]">
                        <td className="p-4">
                          <Link
                            href={`${adminRoute}/posts/${post.slug}`}
                            className="font-medium hover:text-[var(--accent-2)] transition-colors"
                          >
                            {post.title}
                          </Link>
                          <p className="text-sm text-[var(--muted)] mt-1 line-clamp-1">{post.description}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell text-sm font-mono text-[var(--muted)]">
                          {post.slug}
                        </td>
                        <td className="p-4 hidden lg:table-cell text-sm text-[var(--muted)]">
                          {post.category}
                        </td>
                        <td className="p-4 text-sm text-[var(--muted)]">{formatDateShort(post.date)}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              post.draft
                                ? "bg-[rgba(245,158,11,0.15)] text-[rgb(245,158,11)] border border-[rgb(245,158,11)]"
                                : "bg-[rgba(31,58,36,0.15)] text-[var(--accent-2)] border border-[var(--accent-2)]"
                            }`}
                          >
                            {post.draft ? "Draft" : "Published"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`${adminRoute}/posts/${post.slug}`}
                              className="btn btn-ghost text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(post.slug)}
                              disabled={deletingSlug === post.slug}
                              className="btn btn-ghost text-sm text-[rgb(239,68,68)] hover:bg-[rgba(239,68,68,0.1)]"
                              aria-label={`Delete ${post.title}`}
                            >
                              {deletingSlug === post.slug ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === "accounts" && (
          <div className="glass overflow-hidden">
            <div className="p-4 border-b border-[var(--card-border)]">
              <h2 className="font-display text-lg font-semibold text-[var(--text)]">Admin Accounts</h2>
              <p className="text-sm text-[var(--muted)] mt-1">
                Manage the two allowlisted admin accounts. Only the other active admin can disable an account.
              </p>
            </div>
            {loadingAccounts ? (
              <div className="p-12 text-center text-[var(--muted)]">Loading accounts…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" role="grid">
                  <thead>
                    <tr className="border-b border-[var(--card-border)]">
                      <th className="text-left p-4 font-medium text-[var(--muted)] text-sm">Email</th>
                      <th className="text-left p-4 font-medium text-[var(--muted)] text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-[var(--muted)] text-sm hidden md:table-cell">Last Login</th>
                      <th className="text-left p-4 font-medium text-[var(--muted)] text-sm">Created</th>
                      <th className="text-right p-4 font-medium text-[var(--muted)] text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--secondary)]">
                        <td className="p-4 font-mono text-sm">{account.email}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              account.is_active
                                ? "bg-[rgba(31,58,36,0.15)] text-[var(--accent-2)] border border-[var(--accent-2)]"
                                : "bg-[rgba(239,68,68,0.15)] text-[rgb(239,68,68)] border border-[rgb(239,68,68)]"
                            }`}
                          >
                            {account.is_active ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="p-4 hidden md:table-cell text-sm text-[var(--muted)]">
                          {account.last_login_at ? formatDate(account.last_login_at) : "Never"}
                        </td>
                        <td className="p-4 text-sm text-[var(--muted)]">
                          {formatDate(account.created_at)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleAccountActive(account.email, !account.is_active)}
                              disabled={!account.is_active && accounts.filter(a => a.is_active).length <= 1}
                              className={`btn btn-ghost text-sm ${
                                account.is_active
                                  ? "text-[rgb(239,68,68)] hover:bg-[rgba(239,68,68,0.1)]"
                                  : "text-[var(--accent-2)] hover:bg-[rgba(31,58,36,0.1)]"
                              }`}
                              aria-label={account.is_active ? `Disable ${account.email}` : `Enable ${account.email}`}
                            >
                              {account.is_active ? "Disable" : "Enable"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <>
            {/* Login Attempts */}
            <div className="glass overflow-hidden">
              <div className="p-4 border-b border-[var(--card-border)]">
                <h2 className="font-display text-lg font-semibold text-[var(--text)]">Recent Login Attempts</h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Shows the last 50 attempts. Locked accounts show a lock icon.
                </p>
              </div>
              {loadingAttempts ? (
                <div className="p-12 text-center text-[var(--muted)]">Loading attempts…</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" role="grid">
                    <thead>
                      <tr className="border-b border-[var(--card-border)]">
                        <th className="text-left p-4 font-medium text-[var(--muted)] text-sm">Email</th>
                        <th className="text-left p-4 font-medium text-[var(--muted)] text-sm">Time</th>
                        <th className="text-left p-4 font-medium text-[var(--muted)] text-sm">Result</th>
                        <th className="text-left p-4 font-medium text-[var(--muted)] text-sm hidden md:table-cell">IP</th>
                        <th className="text-left p-4 font-medium text-[var(--muted)] text-sm hidden lg:table-cell">User Agent</th>
                        <th className="text-right p-4 font-medium text-[var(--muted)] text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((attempt) => (
                        <tr key={attempt.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--secondary)]">
                          <td className="p-4 font-mono text-sm">{attempt.email}</td>
                          <td className="p-4 text-sm text-[var(--muted)]">{formatDate(attempt.attempted_at)}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              attempt.success
                                ? "bg-[rgba(31,58,36,0.15)] text-[var(--accent-2)] border border-[var(--accent-2)]"
                                : attempt.locked_out
                                ? "bg-[rgba(239,68,68,0.15)] text-[rgb(239,68,68)] border border-[rgb(239,68,68)]"
                                : "bg-[rgba(245,158,11,0.15)] text-[rgb(245,158,11)] border border-[rgb(245,158,11)]"
                            }`}>
                              {attempt.locked_out ? "Locked" : attempt.success ? "Success" : "Failed"}
                            </span>
                          </td>
                          <td className="p-4 hidden md:table-cell text-sm text-[var(--muted)] font-mono">
                            {attempt.ip || "Unknown"}
                          </td>
                          <td className="p-4 hidden lg:table-cell text-sm text-[var(--muted)] max-w-xs truncate">
                            {attempt.user_agent || "Unknown"}
                          </td>
                          <td className="p-4 text-right">
                            {!attempt.success && attempt.locked_out && (
                              <button
                                onClick={() => clearLockout(attempt.email)}
                                className="btn btn-ghost text-sm text-[var(--accent-2)] hover:bg-[rgba(31,58,36,0.1)]"
                                aria-label={`Clear lockout for ${attempt.email}`}
                              >
                                Clear lockout
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="glass p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-[var(--text)]">Change Password</h2>
              <p className="text-sm text-[var(--muted)]">
                Change your admin password. You must know your current password.
              </p>
              <form onSubmit={handlePasswordChange} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    disabled={changingPassword}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium mb-1">
                    New Password (min 8 characters)
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={changingPassword}
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={changingPassword}
                    required
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-[rgb(239,68,68)]" role="alert">
                    {passwordError}
                  </p>
                )}
                {passwordSuccess && (
                  <p className="text-sm text-[var(--accent-2)]" role="status">
                    {passwordSuccess}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-full sm:w-auto"
                  disabled={changingPassword}
                >
                  {changingPassword ? "Changing…" : "Change Password"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
