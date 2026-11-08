"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function AdminDashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch {
      // Even if logout fails, redirect to login
      router.push("/admin/login");
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
        router.push("/admin/login");
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

  useEffect(() => {
    let cancelled = false;
    const loadPosts = async () => {
      try {
        const res = await fetch("/api/admin/posts", {
          credentials: "same-origin",
        });

        if (res.status === 401) {
          router.push("/admin/login");
          router.refresh();
          return;
        }

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load posts");
        }

        const data = await res.json();
        if (!cancelled) setPosts(data.posts || []);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const formatDate = (dateStr: string) => {
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
            <h1 className="font-display text-2xl font-semibold">Nexlane admin</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Changes save to blog.json and go live on the next deploy.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/posts/new" className="btn btn-primary">
              New post
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost">
              Log out
            </button>
          </div>
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

        {/* Posts table */}
        <div className="glass overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-[var(--muted)]">
              No posts yet. <Link href="/admin/posts/new" className="text-[var(--accent)] hover:underline">
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
                    <tr key={post.slug} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[rgba(125,196,255,0.03)]">
                      <td className="p-4">
                        <Link
                          href={`/admin/posts/${post.slug}`}
                          className="font-medium hover:text-[var(--accent)] transition-colors"
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
                      <td className="p-4 text-sm text-[var(--muted)]">{formatDate(post.date)}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.draft
                              ? "bg-[rgba(245,158,11,0.15)] text-[rgb(245,158,11)] border border-[rgb(245,158,11)]"
                              : "bg-[rgba(30,211,242,0.15)] text-[var(--accent)] border border-[var(--accent)]"
                          }`}
                        >
                          {post.draft ? "Draft" : "Published"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/posts/${post.slug}`}
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
      </div>
    </main>
  );
}