import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromServer } from "@/lib/auth-server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const threadId = parseInt(id, 10);

    if (isNaN(threadId)) {
      return NextResponse.json({ error: "Invalid forum ID" }, { status: 400 });
    }

    const sql = `
      SELECT 
        forum_threads.id,
        forum_threads.author_id,
        forum_threads.category,
        forum_threads.title,
        forum_threads.content,
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
      WHERE forum_threads.id = ?
    `;
    const results = await query(sql, [threadId]);

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: "Forum not found" }, { status: 404 });
    }

    const thread = results[0];
    return NextResponse.json({ thread }, { status: 200 });
  } catch (error) {
    console.error("Error fetching thread detail:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const threadId = parseInt(id, 10);

    if (isNaN(threadId)) {
      return NextResponse.json({ error: "Invalid forum ID" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      const sql = `
        UPDATE forum_threads
        SET views = views + 1, updated_at = NOW()
        WHERE id = ?
      `;
      await query(sql, [threadId]);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Method not supported with body" },
      { status: 405 }
    );
  } catch (error) {
    console.error("Error updating forum:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const threadId = parseInt(id, 10);

    if (isNaN(threadId)) {
      return NextResponse.json({ error: "Invalid forum ID" }, { status: 400 });
    }

    const { action } = await request.json();
    if (!action || !["like", "unlike"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const sql = `
      UPDATE forum_threads
      SET likes = likes ${action === "like" ? "+" : "-"} 1, updated_at = NOW()
      WHERE id = ?
    `;
    await query(sql, [threadId]);

    const fetchSql = `SELECT likes FROM forum_threads WHERE id = ?`;
    const results = (await query(fetchSql, [threadId])) as { likes: number }[];

    const newLikes =
      Array.isArray(results) && results.length > 0 ? results[0].likes : 0;

    return NextResponse.json(
      { success: true, likes: newLikes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating likes:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromServer();
    if (!user || !user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const threadId = parseInt(id, 10);
    
    if (!threadId) {
      return NextResponse.json({ error: "Forum ID is required" }, { status: 400 });
    }

    const checkSql = "SELECT author_id FROM forum_threads WHERE id = ?";
    const checkResult = await query(checkSql, [threadId]) as any[];

    if (!checkResult || checkResult.length === 0) {
      return NextResponse.json({ error: "Forum not found" }, { status: 404 });
    }

    const forum = checkResult[0];
    if (forum.author_id !== user.userId) {
      return NextResponse.json({ error: "You can only delete your own forums" }, { status: 403 });
    }

    const deleteSql = "DELETE FROM forum_threads WHERE id = ?";
    await query(deleteSql, [threadId]);

    return NextResponse.json({ message: "Forum deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting forum:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}
