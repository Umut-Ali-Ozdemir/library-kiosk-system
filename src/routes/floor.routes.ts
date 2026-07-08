import { Router } from "express";
import { getAllFloors } from "../controllers/floor.controller";

const router = Router();

router.get("/floors", getAllFloors);

export default router;
