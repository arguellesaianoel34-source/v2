import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import contactsRouter from "./contacts.js";
import testimonialsRouter from "./testimonials.js";
import commentsRouter from "./comments.js";
import statsRouter from "./stats.js";
import contentRouter from "./content.js";
import emailRouter from "./email.js";

const router = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(contactsRouter);
router.use(testimonialsRouter);
router.use(commentsRouter);
router.use(statsRouter);
router.use(contentRouter);
router.use(emailRouter);

export default router;
