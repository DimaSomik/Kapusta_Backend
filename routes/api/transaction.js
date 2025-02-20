import { Router } from "express";

import { validateAddIncome, validateAddExpsense, validateDeleteTransaction, validatePeriod } from "../../middlewares/validation.js";
  
import { transactionsController } from "../../controllers/transaction.js";
import { isUserLogged } from "../../middlewares/isUserLogged.js";

const router = Router();

router.route("/expense")
    .get(isUserLogged, transactionsController.expenseStats)
    .post(isUserLogged, validateAddExpsense, transactionsController.addExpense)

router.route("/income")
    .post(isUserLogged, validateAddIncome, transactionsController.addIncome)
    .get(isUserLogged, transactionsController.incomeStats);

router.delete("/:transactionId", isUserLogged, validateDeleteTransaction, transactionsController.deleteTransaction);

router.get("/period-data", isUserLogged, validatePeriod, transactionsController.transactionsDataForPeriod);

router.get("/income-categories", isUserLogged, transactionsController.incomeCategories);

router.get("/expense-categories", isUserLogged, transactionsController.expenseCategories);

export default router;