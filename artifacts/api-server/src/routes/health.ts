import { Router } from "express";
import type { Request, Response } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router = Router();

router.get("/healthz", (req: Request, res: Response) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.status(200).json(data);
});

export default router;
