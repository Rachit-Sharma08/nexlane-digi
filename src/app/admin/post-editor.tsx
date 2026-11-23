"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { team } from "@/config/site";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  draft: boolean;
  content: BlogBlock[];
};

type PostEditorProps = {
  initialPost?: BlogPost;
  isEditing: boolean;
  onSave: (post: BlogPost) => Promise<void>;
};

const BLOCK_TYPES: { value: BlogBlock["type"]; label: string }[] = [
  { value: "p", label: "Paragraph" },
  { value: "h", label: "Heading" },
  { value: "list", label: "List" },
  { value: "quote", label: "Quote" },
];

function createEmptyBlock(type: BlogBlock["type"]): BlogBlock {
  switch (type) {
    case "p":
      return { type: "p", text: "" };
    case "h":
      return { type: "h", text: "" };
    case "list":
      return { type: "list", items: [""] };
    case "quote":
      return { type: "quote", text: "" };
  }
}

function convertBlock(block: BlogBlock, newType: BlogBlock["type"]): BlogBlock {
  const text =
    block.type === "list" ? block.items.join("\n") : "text" in block ? block.text : "";
  switch (newType) {
    case "p":
      return { type: "p", text };
    case "h":
      return { type: "h", text };
    case "list":
      return { type: "list", items: text.split("\n").filter((s) => s.trim()) || [""] };
    case "quote":
      return { type: "quote", text };
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PostEditor({ initialPost, isEditing, onSave }: PostEditorProps) {
  const router = useRouter();
  const isNew = !isEditing;

  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [description, setDescription] = useState(initialPost?.description || "");
  const [category, setCategory] = useState(initialPost?.category || "");
  const [date, setDate] = useState(initialPost?.date || new Date().toISOString().split("T")[0]);
  const [author, setAuthor] = useState(initialPost?.author || team[0]?.name || "");
  const [draft, setDraft] = useState(initialPost?.draft ?? true);
  const [blocks, setBlocks] = useState<BlogBlock[]>(initialPost?.content || [{ type: "p", text: "" }]);
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [slugError, setSlugError] = useState("");

  // Auto-generate slug from title for new posts - update slug when title changes
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isNew) {
      const generated = generateSlug(value);
      setSlug(generated);
      setSlugError("");
    }
  };

  // Validate slug on change (for new posts)
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSlug(value);
    if (value && !/^[a-z0-9-]+$/.test(value)) {
      setSlugError("Slug must be lowercase letters, numbers, and hyphens only");
    } else {
      setSlugError("");
    }
  };

  const handleBlockTypeChange = (index: number, newType: BlogBlock["type"]) => {
    setBlocks((prev) =>
      prev.map((block, i) => (i === index ? convertBlock(block, newType) : block))
    );
  };

  const handleBlockTextChange = (index: number, text: string) => {
    setBlocks((prev) =>
      prev.map((block, i) =>
        i === index ? { ...block, text } : block
      )
    );
  };

  const handleListItemsChange = (index: number, items: string[]) => {
    setBlocks((prev) =>
      prev.map((block, i) =>
        i === index && block.type === "list" ? { ...block, items } : block
      )
    );
  };

  const handleAddBlock = (type: BlogBlock["type"]) => {
    setBlocks((prev) => [...prev, createEmptyBlock(type)]);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setBlocks((prev) => {
      const next = [...prev];
      [next[index], next[index - 1]] = [next[index - 1], next[index]];
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    setBlocks((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleRemoveBlock = (index: number) => {
    if (blocks.length <= 1) return;
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): string | null => {
    if (!title.trim()) return "Title is required";
    if (!slug.trim()) return "Slug is required";
    if (!/^[a-z0-9-]+$/.test(slug)) return "Slug must be lowercase letters, numbers, and hyphens only";
    if (!description.trim()) return "Description is required";
    if (description.length > 300) return "Description must be 300 characters or fewer";
    if (!category.trim()) return "Category is required";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Date must be YYYY-MM-DD";
    if (!author.trim()) return "Author is required";
    if (blocks.length < 1) return "At least one content block is required";
    for (const block of blocks) {
      if (block.type === "p" || block.type === "h" || block.type === "quote") {
        if (!block.text.trim()) return `${block.type === "p" ? "Paragraph" : block.type === "h" ? "Heading" : "Quote"} text cannot be empty`;
        if (block.text.length > 5000) return "Block text must be 5000 characters or fewer";
      } else if (block.type === "list") {
        if (block.items.length < 1) return "List must have at least 1 item";
        if (block.items.length > 50) return "List must have 50 items or fewer";
        for (const item of block.items) {
          if (!item.trim()) return "List items cannot be empty";
          if (item.length > 500) return "List items must be 500 characters or fewer";
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const error = validateForm();
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    setSaving(true);
    const post: BlogPost = {
      slug: isEditing ? initialPost!.slug : slug,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      date,
      author: author.trim(),
      draft,
      content: blocks,
    };

    try {
      await onSave(post);
      setStatus({ type: "success", message: "Saved — goes live on the next deploy." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save";
      setStatus({ type: "error", message });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push("/admin");
    router.refresh();
  };

  // Description character count
  const descCount = description.length;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      <div className="glass p-6 space-y-6">
        <h1 className="font-display text-2xl font-semibold">{isEditing ? "Edit Post" : "New Post"}</h1>

        {/* Status message */}
        {status && (
          <div
            role="alert"
            aria-live="polite"
            className={`p-4 rounded-lg text-sm ${
              status.type === "success"
                ? "bg-[rgba(31,58,36,0.15)] border border-[var(--brand)] text-[var(--brand)]"
                : "bg-[rgba(239,68,68,0.15)] border border-[rgb(239,68,68)] text-[rgb(239,68,68)]"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              placeholder="Post title"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">
              Slug (URL)
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={handleSlugChange}
              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              placeholder="post-slug"
              required
              disabled={saving || isEditing}
              readOnly={isEditing}
              aria-describedby={slugError ? "slug-error" : undefined}
            />
            {slugError && (
              <p id="slug-error" className="mt-1 text-sm text-[rgb(239,68,68)]" role="alert">
                {slugError}
              </p>
            )}
            {isEditing && (
              <p className="mt-1 text-sm text-[var(--muted)]">Slug cannot be changed after creation</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description <span className="text-[var(--muted)]">({descCount}/300)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={300}
            className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
            placeholder="Brief description for SEO and previews (max 300 characters)"
            required
            disabled={saving}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              placeholder="e.g., Local SEO"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-1">
              Author
            </label>
            <select
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-3 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent appearance-none"
              required
              disabled={saving}
            >
              {team.map((member) => (
                <option key={member.slug} value={member.name}>
                  {member.name} ({member.group === "founders" ? "Founder" : "Team"})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="draft"
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
            className="w-5 h-5 accent-[var(--accent)] border-[var(--card-border)] rounded focus:ring-2 focus:ring-[var(--accent)]"
            disabled={saving}
          />
          <label htmlFor="draft" className="text-sm font-medium cursor-pointer">
            Save as draft (not published)
          </label>
        </div>
      </div>

      {/* Block Editor */}
      <div className="glass p-6 space-y-6">
        <h2 className="font-display text-xl font-semibold">Content Blocks</h2>
        <p className="text-sm text-[var(--muted)]">
          Each block is a paragraph, heading, list, or quote. Reorder with Move buttons.
        </p>

        {blocks.map((block, index) => (
          <div key={index} className="border border-[var(--card-border)] rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              {/* Block type selector */}
              <select
                value={block.type}
                onChange={(e) => handleBlockTypeChange(index, e.target.value as BlogBlock["type"])}
                className="w-28 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm"
                disabled={saving}
              >
                {BLOCK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              {/* Block content */}
              <div className="flex-1 min-w-0 space-y-2">
                {block.type === "list" ? (
                  <div className="space-y-2">
                    {block.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2">
                        <textarea
                          value={item}
                          onChange={(e) => {
                            const newItems = [...block.items];
                            newItems[itemIndex] = e.target.value;
                            handleListItemsChange(index, newItems);
                          }}
                          rows={2}
                          className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm resize-none"
                          placeholder={`List item ${itemIndex + 1}`}
                          disabled={saving}
                        />
                        {block.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleListItemsChange(index, block.items.filter((_, i) => i !== itemIndex))}
                            className="btn btn-ghost h-10 px-3 text-sm"
                            disabled={saving}
                            aria-label={`Remove list item ${itemIndex + 1}`}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleListItemsChange(index, [...block.items, ""])}
                      className="btn btn-ghost text-sm"
                      disabled={saving || block.items.length >= 50}
                      aria-label="Add list item"
                    >
                      + Add item
                    </button>
                  </div>
                ) : (
                  <textarea
                    value={block.text}
                    onChange={(e) => handleBlockTextChange(index, e.target.value)}
                    rows={block.type === "p" ? 4 : block.type === "h" ? 2 : 3}
                    className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
                    placeholder={
                      block.type === "p"
                        ? "Paragraph text..."
                        : block.type === "h"
                        ? "Heading text..."
                        : "Quote text..."
                    }
                    disabled={saving}
                  />
                )}
              </div>

              {/* Move / Remove buttons */}
              <div className="flex flex-col gap-1 self-start">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={saving || index === 0}
                  className="btn btn-ghost h-9 w-9 p-0"
                  aria-label="Move block up"
                  aria-disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={saving || index === blocks.length - 1}
                  className="btn btn-ghost h-9 w-9 p-0"
                  aria-label="Move block down"
                  aria-disabled={index === blocks.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveBlock(index)}
                  disabled={saving || blocks.length <= 1}
                  className="btn btn-ghost h-9 w-9 p-0 text-[rgb(239,68,68)] hover:bg-[rgba(239,68,68,0.1)]"
                  aria-label="Remove block"
                  aria-disabled={blocks.length <= 1}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add block buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {BLOCK_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleAddBlock(t.value)}
              className="btn btn-ghost text-sm"
              disabled={saving || blocks.length >= 100}
              aria-label={`Add ${t.label} block`}
            >
              + {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end">
        <button
          type="button"
          onClick={handleBack}
          className="btn btn-ghost"
          disabled={saving}
        >
          Back to posts
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? "Saving…" : isEditing ? "Save changes" : "Create post"}
        </button>
      </div>
    </form>
  );
}