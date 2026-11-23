import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin-auth-supabase';
import { validatePostUpdate } from '@/lib/admin-validate';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!await getAdminRequestContext()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const posts = await readPosts();
  if (posts === null) {
    return NextResponse.json({ error: 'Blog content unreadable' }, { status: 500 });
  }
  const post = posts.find(p => p.slug === slug);
  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ post });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!await getAdminRequestContext()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  const validation = validatePostUpdate(input, slug);
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
  const index = posts.findIndex(p => p.slug === slug);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  posts[index] = validation.post;
  await writePosts(posts);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  await appendAuditLog({
    timestamp: new Date().toISOString(),
    action: 'update_post',
    ip,
    slug,
    success: true,
  });

  return NextResponse.json({ post: validation.post });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!await getAdminRequestContext()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const posts = await readPosts();
  if (posts === null) {
    return NextResponse.json({ error: 'Blog content unreadable' }, { status: 500 });
  }
  const index = posts.findIndex(p => p.slug === slug);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }

  posts.splice(index, 1);
  await writePosts(posts);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  await appendAuditLog({
    timestamp: new Date().toISOString(),
    action: 'delete_post',
    ip,
    slug,
    success: true,
  });

  return NextResponse.json({ ok: true });
}
