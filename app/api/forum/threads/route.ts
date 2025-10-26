import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromServer } from "@/lib/auth-server"; // Asumsikan ada fungsi ini untuk autentikasi server-side

export async function GET(request: NextRequest) {
  try {
    const sql = `
      SELECT 
        forum_threads.id,
        forum_threads.author_id,
        forum_threads.category,
        forum_threads.title,
        forum_threads.is_pinned,
        forum_threads.views,
        forum_threads.replies_count,
        forum_threads.likes,
        forum_threads.created_at,
        forum_threads.updated_at,
        users.name AS author_name,
        users.city AS author_city
      FROM forum_threads
      INNER JOIN users ON users.id = forum_threads.author_id
      ORDER BY created_at DESC
    `;
    const results = await query(sql, []);

    if (!Array.isArray(results)) {
      return NextResponse.json({ error: "Unexpected query result" }, { status: 500 });
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching threads:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromServer();
    if (!user || !user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, category, content, author_id, is_pinned, views, replies_count, likes } = await request.json();
    if (!title || !category || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = `
      INSERT INTO forum_threads (author_id, category, title, content, is_pinned, views, replies_count, likes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const params = [user.userId, category, title, content, is_pinned || false, views || 0, replies_count || 0, likes || 0];
    const result = await query(sql, params) as { insertId?: number } | { insertId?: number }[];

    const newThreadId = Array.isArray(result) ? result[0]?.insertId : result?.insertId;
    if (typeof newThreadId !== "number") {
      return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
    }
    const newThread = {
      id: newThreadId,
      author_id: user.userId,
      category,
      title,
      content,
      is_pinned: is_pinned || false,
      views: views || 0,
      replies_count: replies_count || 0,
      likes: likes || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(newThread, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}