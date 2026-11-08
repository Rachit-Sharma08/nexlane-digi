"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PostEditor } from "@/app/admin/post-editor";
import type { BlogPost } from "@/app/admin/post-editor";

type EditPostClientProps = {
  slug: string;
};

export function EditPostClient({ slug }: EditPostClientProps) {
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${slug}`, {
          credentials: "same-origin",
        });

        if (res.status === 401) {
          router.push("/admin/login");
          router.refresh();
          return;
        }

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load post");
        }

        const data = await res.json();
        if (!cancelled) setPost(data.post);
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPost();
    return () => {
      cancelled = true;
    };
  }, [slug, router]);

  const handleSave = async (updatedPost: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(updatedPost),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update post");
      }

      // Success - PostEditor will show success message
    } catch (err: unknown) {
      throw err;
    }
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="text-center text-[var(--muted)]">Loading…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/admin" className="btn btn-ghost text-sm">
              ← Back to posts
            </Link>
          </div>
          <div
            className="p-4 rounded-lg bg-[rgba(239,68,68,0.15)] border border-[rgb(239,68,68)] text-[rgb(239,68,68)] text-sm"
            role="alert"
          >
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/admin" className="btn btn-ghost text-sm">
              ← Back to posts
            </Link>
          </div>
          <div
            className="p-4 rounded-lg bg-[rgba(239,68,68,0.15)] border border-[rgb(239,68,68)] text-[rgb(239,68,68)] text-sm"
            role="alert"
          >
            Post not found
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin" className="btn btn-ghost text-sm">
            ← Back to posts
          </Link>
        </div>
        <PostEditor initialPost={post} isEditing={true} onSave={handleSave} />
      </div>
    </main>
  );
}