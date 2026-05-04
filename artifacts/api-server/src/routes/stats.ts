import { Router } from "express";
import { contactsRepo, testimonialsRepo, commentsRepo } from "@workspace/db";
import { requireAuth } from "./auth.js";

const router = Router();

router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const [
      totalContacts,
      newContacts,
      respondedContacts,
      totalTestimonials,
      totalComments,
      pendingComments,
      recentContacts
    ] = await Promise.all([
        contactsRepo.countByStatus(),
        contactsRepo.countByStatus("new"),
        contactsRepo.countByStatus("responded"),
        testimonialsRepo.count(),
        commentsRepo.countByStatus(),
        commentsRepo.countByStatus("pending"),
        contactsRepo.recent(5),
      ]);

    return res.json({
      totalContacts,
      newContacts,
      respondedContacts,
      totalTestimonials,
      totalComments,
      pendingComments,
      recentContacts,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting dashboard stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
