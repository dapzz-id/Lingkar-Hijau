import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromServer } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const threadIdParam = searchParams.get("thread_id");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Validasi parameter
    if (!threadIdParam) {
      return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
    }
    const threadId = Number(threadIdParam);
    if (isNaN(threadId) || isNaN(page) || isNaN(limit) || isNaN(offset)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    console.log("Query Params:", { threadId, limit, offset }); // Debugging

    const sql = `
        SELECT forum_replies.id, thread_id, author_id, content, likes, forum_replies.created_at, users.name AS author_name, users.city AS author_city
        FROM forum_replies
        INNER JOIN users ON users.id = forum_replies.author_id
        WHERE thread_id = ?
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
    `;
    const params = [threadId];
    const results = await query(sql, params);


    if (!Array.isArray(results)) {
      return NextResponse.json({ error: "Unexpected query result" }, { status: 500 });
    }

    return NextResponse.json({ replies: results }, { status: 200 });
  } catch (error) {
    console.error("Error fetching replies:", error);
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

    const { thread_id, content } = await request.json();
    if (!thread_id || !content) {
      return NextResponse.json({ error: "Thread ID and content are required" }, { status: 400 });
    }

    const sql = `
      INSERT INTO forum_replies (thread_id, author_id, content, likes, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const params = [thread_id, user.userId, content, 0];
    const result = await query(sql, params);

    const newReplyId = Array.isArray(result) && result.length > 0 && "insertId" in result[0]
      ? (result[0] as any).insertId
      : (result as any).insertId;

    const newReply = {
      id: newReplyId,
      thread_id,
      author_id: user.userId,
      content,
      likes: 0,
      created_at: new Date().toISOString(),
    };

    const updateSql = `
      UPDATE forum_threads
      SET replies_count = replies_count + 1, updated_at = NOW()
      WHERE id = ?
    `;
    await query(updateSql, [thread_id]);

    return NextResponse.json(newReply, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}