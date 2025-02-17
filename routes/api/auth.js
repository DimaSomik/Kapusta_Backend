import { Router } from "express";

import { validateAuth, validateRefreshToken } from "../../middlewares/validation.js";
  
import { authController } from "../../controllers/auth.js";
import { isUserLogged } from "../../middlewares/isUserLogged.js";

const router = Router();

router.post("/register", validateAuth, authController.register);


router.post("/login", validateAuth, authController.login);

router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);

router.post("/logout", isUserLogged, authController.logout);

router.post("/refresh", validateRefreshToken, authController.refreshToken)

export default router;