import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin-auth-supabase';
import { validatePost } from '@/lib/admin-validate';
import { BlogPost } from '@/content/blog';
import path from 'path';

const blogJsonPath = path.join(process.cwd(), 'src/content/blog.json');

// null = file exists but is corrupt — never treat that as "no posts",
// or a write would wipe existing content.
async function readPosts(): Promise<BlogPost[] | null> {
  const fs = await import('fs/promises');
  try {
    const data = await fs.readFile(blogJsonPath, 'utf-8');
    return JSON.parse(data) as BlogPost[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    return null;
  }
}

async function writePosts(posts: BlogPost[]): Promise<void> {
  const fs = await import('fs/promises');
  const tmpPath = `${blogJsonPath}.tmp`; // same dir → atomic rename
  await fs.writeFile(tmpPath, JSON.stringify(posts, null, 2), 'utf-8');
  await fs.rename(tmpPath, blogJsonPath);
}

async function appendAuditLog(entry: Record<string, unknown>): Promise<void> {
  // best-effort: a read-only fs (serverless) must never fail the request
  try {
    const fs = await import('fs/promises');
    const logDir = path.join(process.cwd(), 'data');
    await fs.mkdir(logDir, { recursive: true });
    await fs.appendFile(path.join(logDir, 'admin-audit.log'), JSON.stringify(entry) + '\n', 'utf-8');
  } catch {
    // ignore
  }
}

export async function GET() {
  if (!await getAdminRequestContext()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const posts = await readPosts();
  if (posts === null) {
    return NextResponse.json({ error: 'Blog content unreadable' }, { status: 500 });
  }
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  if (!await getAdminRequestContext()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  const validation = validatePost(input);
  if (!validation.ok) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const posts = await readPosts();
  if (posts === null) {
    return NextResponse.json({ error: 'Blog content unreadable' }, { status: 500 });
  }

  if (posts.some(p => p.slug === validation.post.slug)) {
    return NextResponse.json(
      { error: 'slug already exists' },
      { status: 409 }
    );
  }

  posts.push(validation.post);
  await writePosts(posts);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  await appendAuditLog({
    timestamp: new Date().toISOString(),
    action: 'create_post',
    ip,
    slug: validation.post.slug,
    success: true,
  });

  return NextResponse.json({ post: validation.post }, { status: 201 });
}
