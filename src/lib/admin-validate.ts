import type { BlogPost, BlogBlock } from '../content/blog.ts';
import { team } from '../config/site.ts';

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

function isValidAuthor(author: string): boolean {
  const teamNames = team.map(m => m.name);
  return teamNames.includes(author);
}

function isValidBlock(block: BlogBlock): string | null {
  if (block.type === 'p' || block.type === 'h' || block.type === 'quote') {
    if (!block.text || block.text.length > 5000) {
      return `${block.type} block text must be 1-5000 characters`;
    }
  } else if (block.type === 'list') {
    if (!block.items || block.items.length < 1 || block.items.length > 50) {
      return 'list must have 1-50 items';
    }
    for (const item of block.items) {
      if (!item || item.length > 500) {
        return 'list items must be 1-500 characters each';
      }
    }
  } else {
    return `unknown block type "${(block as { type: string }).type}"`;
  }
  return null;
}

export function validatePost(input: unknown): { ok: true; post: BlogPost } | { ok: false; error: string } {
  const p = input as Record<string, unknown>;
  
  if (!p.slug || typeof p.slug !== 'string' || !isValidSlug(p.slug)) {
    return { ok: false, error: 'slug must be lowercase alphanumeric with hyphens only' };
  }
  
  if (!p.title || typeof p.title !== 'string' || p.title.length === 0 || p.title.length > 200) {
    return { ok: false, error: 'title must be 1-200 characters' };
  }
  
  if (!p.description || typeof p.description !== 'string' || p.description.length === 0 || p.description.length > 300) {
    return { ok: false, error: 'description must be 1-300 characters' };
  }
  
  if (!p.category || typeof p.category !== 'string' || p.category.length === 0 || p.category.length > 60) {
    return { ok: false, error: 'category must be 1-60 characters' };
  }
  
  if (!p.date || typeof p.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) {
    return { ok: false, error: 'date must be YYYY-MM-DD' };
  }
  
  if (!p.author || typeof p.author !== 'string' || !isValidAuthor(p.author)) {
    return { ok: false, error: 'author must be a valid team member name' };
  }
  
  const draft = typeof p.draft === 'boolean' ? p.draft : true;
  
  if (!Array.isArray(p.content) || p.content.length < 1 || p.content.length > 100) {
    return { ok: false, error: 'content must be an array of 1-100 blocks' };
  }
  
  for (const block of p.content) {
    const blockError = isValidBlock(block as BlogBlock);
    if (blockError) {
      return { ok: false, error: blockError };
    }
  }
  
  const post: BlogPost = {
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: p.date,
    author: p.author,
    draft,
    content: p.content as BlogBlock[],
  };
  
  return { ok: true, post };
}

export function validatePostUpdate(input: unknown, existingSlug: string): { ok: true; post: BlogPost } | { ok: false; error: string } {
  const result = validatePost(input);
  if (!result.ok) return result;
  
  if (result.post.slug !== existingSlug) {
    return { ok: false, error: 'slug cannot be changed; URL slug is authoritative' };
  }
  
  return result;
}