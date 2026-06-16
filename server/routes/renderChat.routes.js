import { Router } from "express";
import { renderChat } from "../controllers/renderChat.controllers.js";

const router = Router();

router.get("/users/:id", renderChat);

export default router;