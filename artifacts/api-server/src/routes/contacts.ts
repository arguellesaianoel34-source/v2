import { Router } from "express";
import { contactsRepo } from "@workspace/db";
import { requireAuth } from "./auth.js";
import { sendContactNotification } from "../lib/email.js";

const router = Router();

router.post("/contacts", async (req, res) => {
  try {
    const { name, email, phone, company, service, message } = req.body as {
      name: string;
      email: string;
      phone?: string;
      company?: string;
      service?: string;
      message: string;
    };

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "name, email, and message are required" });
    }

    const contact = await contactsRepo.create({
      name,
      email,
      phone: phone ?? null,
      company: company ?? null,
      service: service ?? null,
      message,
      status: "new",
    });

    // Send email notification (don't wait for it to complete)
    sendContactNotification({
      name,
      email,
      phone,
      company,
      service,
      message,
    }).catch((err) => {
      req.log.error({ err }, "Error sending email notification");
    });

    return res.status(201).json(contact);
  } catch (err) {
    req.log.error({ err }, "Error creating contact");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contacts", requireAuth, async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const status = req.query.status as string | undefined;

    const { items, total } = await contactsRepo.list({ page, limit, status });

    return res.json({
      contacts: items,
      total,
      page,
      limit,
    });
  } catch (err) {
    req.log.error({ err }, "Error listing contacts");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contacts/:id", requireAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const contact = await contactsRepo.getById(id);
    if (!contact) return res.status(404).json({ error: "Not found" });
    return res.json(contact);
  } catch (err) {
    req.log.error({ err }, "Error getting contact");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/contacts/:id", requireAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body as { status?: "new" | "read" | "responded" };

    const contact = await contactsRepo.update(id, status ? { status } : {});
    if (!contact) return res.status(404).json({ error: "Not found" });
    return res.json(contact);
  } catch (err) {
    req.log.error({ err }, "Error updating contact");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/contacts/:id", requireAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    await contactsRepo.delete(id);
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    req.log.error({ err }, "Error deleting contact");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
