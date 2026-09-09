import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { authLoginSchema } from "../schemas/authSchema.js";
import { AuthController } from "../controllers/auth.js";

// @REVISAR: rutas de autenticacion
export const authRouter = Router()

authRouter.post("/login", validate(authLoginSchema), AuthController.login);
