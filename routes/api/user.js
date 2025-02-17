import { Router } from "express";

import { validateBalance } from "../../middlewares/validation.js";
  
import { usersController } from "../../controllers/users.js";
import { isUserLogged } from "../../middlewares/isUserLogged.js";

const router = Router();

router.patch("/balance", isUserLogged, validateBalance, usersController.updateUserBalance);

router.get("/", isUserLogged, usersController.getUserData);

export default router;