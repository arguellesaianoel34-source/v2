import { Router } from "express";
import { commentsRepo } from "@workspace/db";
import { requireAuth } from "./auth.js";

const router = Router();

// Public route - get approved comments only
router.get("/", async (req, res) => {
  try {
    const { items } = await commentsRepo.list({ status: "approved" });
    return res.json({ comments: items });
  } catch (err) {
    req.log.error({ err }, "Error listing comments");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Public route - submit a comment (goes to pending status)
router.post("/", async (req, res) => {
  try {
    const { name, email, content } = req.body as {
      name: string;
      email: string;
      content: string;
    };

    if (!name || !email || !content) {
      return res
        .status(400)
        .json({ error: "Name, email, and content are required" });
    }

    if (content.length < 10) {
      return res
        .status(400)
        .json({ error: "Comment must be at least 10 characters" });
    }

    const comment = await commentsRepo.create({
      name,
      email,
      content,
      status: "pending", // All new comments start as pending
    });

    return res.status(201).json({ 
      success: true,
      message: "Comment submitted successfully! It will appear after approval.",
      comment: {
        id: comment.id,
        name: comment.name,
        content: comment.content,
        createdAt: comment.createdAt,
      }
    });
  } catch (err) {
    req.log.error({ err }, "Error creating comment");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin routes - require authentication
router.get("/admin", requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as "pending" | "approved" | "rejected" | undefined;

    const result = await commentsRepo.list({ page, limit, status });
    return res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error listing comments for admin");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/:id", requireAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body as { status: "pending" | "approved" | "rejected" };

    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Valid status is required" });
    }

    const updated = await commentsRepo.update(id, { status });
    if (!updated) {
      return res.status(404).json({ error: "Comment not found" });
    }

    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error updating comment");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/:id", requireAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    await commentsRepo.delete(id);
    return res.json({ success: true, message: "Comment deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Error deleting comment");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
