import { Router } from "express";
import healthRouter from "./health.js";
import authRouter, { requireAuth } from "./auth.js";
import contactsRouter from "./contacts.js";
import testimonialsRouter from "./testimonials.js";
import commentsRouter from "./comments.js";
import statsRouter from "./stats.js";
import contentRouter from "./content.js";
import emailRouter from "./email.js";

const router = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/contacts", contactsRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/comments", commentsRouter);
router.use("/stats", statsRouter);
router.use("/content", contentRouter);
router.use("/email", emailRouter);

export default router;
