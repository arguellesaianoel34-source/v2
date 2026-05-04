import { Router } from "express";
import { testimonialsRepo } from "@workspace/db";
import { requireAuth } from "./auth.js";

const router = Router();

router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await testimonialsRepo.list();
    return res.json({ testimonials });
  } catch (err) {
    req.log.error({ err }, "Error listing testimonials");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/testimonials", requireAuth, async (req, res) => {
  try {
    const { clientName, company, content, rating, facebookUrl } = req.body as {
      clientName: string;
      company?: string;
      content: string;
      rating: number;
      facebookUrl?: string;
    };

    if (!clientName || !content || rating == null) {
      return res
        .status(400)
        .json({ error: "clientName, content, and rating are required" });
    }

    const testimonial = await testimonialsRepo.create({
      clientName,
      company: company ?? null,
      content,
      rating,
      facebookUrl: facebookUrl ?? null,
    });

    return res.status(201).json(testimonial);
  } catch (err) {
    req.log.error({ err }, "Error creating testimonial");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/testimonials/:id", requireAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    await testimonialsRepo.delete(id);
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    req.log.error({ err }, "Error deleting testimonial");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
