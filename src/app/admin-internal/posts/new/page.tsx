"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PostEditor } from "@/app/admin-internal/post-editor";
import type { BlogPost } from "@/app/admin-internal/post-editor";

export default function NewPostPage() {
  const router = useRouter();

  const handleSave = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(post),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      // Success - navigate back to dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      throw err;
    }
  };

  return (
    <main className="min-h-[calc(100dvh-4rem)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin" className="btn btn-ghost text-sm">
            ← Back to posts
          </Link>
        </div>
        <PostEditor isEditing={false} onSave={handleSave} />
      </div>
    </main>
  );
}