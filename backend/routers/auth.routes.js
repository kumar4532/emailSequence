import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import protectedRoutes from "../middlewares/protectedRoutes.js"

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", protectedRoutes, logout)

export default router;