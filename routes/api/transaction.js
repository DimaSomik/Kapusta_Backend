import { Router } from "express";

import { validateAddIncome, validateAddExpsense, validateDeleteTransaction, validatePeriod } from "../../middlewares/validation.js";
  
import { authController } from "../../controllers/auth.js";
import { transactionsController } from "../../controllers/transaction.js";
import { isUserLogged } from "../../middlewares/isUserLogged.js";

const router = Router();

/**
 * @swagger
 * /transaction/expense:
 *   post:
 *     summary: Dodaj nowy wydatek
 *     description: Pozwala zalogowanemu użytkownikowi dodać nowy wydatek i zaktualizować saldo.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "Zakupy spożywcze"
 *               amount:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 1000000000
 *                 example: 150
 *               date:
 *                 type: string
 *                 pattern: >-
 *                   ^\\d{4}-(0[1-9]|1[012])$
 *                 example: "2025-02-11"
 *               category:
 *                 type: string
 *                 enum:
 *                   - Alcohol
 *                   - Education
 *                   - Entertainment
 *                   - Household items
 *                   - Health
 *                   - Other
 *                   - Groceries
 *                   - Sports and hobbies
 *                   - Electronics
 *                   - Transport
 *                   - Utilities and communication
 *                 example: "Transport"
 *     responses:
 *       201:
 *         description: Sukces - wydatek został dodany i saldo zostało zaktualizowane
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newBalance:
 *                   type: number
 *                   example: 8500
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: "Zakupy spożywcze"
 *                     amount:
 *                       type: number
 *                       example: 150
 *                     date:
 *                       type: string
 *                       example: "2025-02-11"
 *                     category:
 *                       type: string
 *                       example: "PRODUCTS"
 *       400:
 *         description: Błąd walidacji - niepoprawne dane w ciele zapytania
 *       401:
 *         description: Brak autoryzacji - token niepoprawny lub wygasł
 *       500:
 *         description: Wewnętrzny błąd serwera
 */

/**
 * @swagger
 *  /transaction/expense:
 *   get:
 *     summary: Pobierz statystyki wydatków
 *     description: Zwraca szczegółowe dane na temat wydatków użytkownika, w tym statystyki miesięczne.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Sukces - zwraca dane dotyczące wydatków i miesięczne statystyki
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expenses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       description:
 *                         type: string
 *                         example: "Zakupy spożywcze"
 *                       amount:
 *                         type: number
 *                         example: 150
 *                       date:
 *                         type: string
 *                         example: "2025-02-11"
 *                       category:
 *                         type: string
 *                         example: "PRODUCTS"
 *                 monthsStats:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                     example: "N/A"
 *       401:
 *         description: Brak autoryzacji - token niepoprawny lub wygasł
 *       500:
 *         description: Wewnętrzny błąd serwera
 */

router.route("/expense")
    .get(isUserLogged, transactionsController.expenseStats)
    .post(isUserLogged, validateAddExpsense, transactionsController.addExpense)



/**
 * @swagger
 * /transaction/income:
 *   post:
 *     summary: Dodaj nowy przychód
 *     description: Pozwala zalogowanemu użytkownikowi dodać nowy przychód i zaktualizować saldo.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 300
 *                 example: "Wynagrodzenie za pracę"
 *               amount:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 1000000000
 *                 example: 5000
 *               date:
 *                 type: string
 *                 pattern: >-
 *                   ^\\d{4}-(0[1-9]|1[012])$
 *                 example: "2025-02-11"
 *               category:
 *                 type: string
 *                 enum:
 *                   - Salary
 *                   - Additional Income
 *                 example: "Salary"
 *     responses:
 *       201:
 *         description: Sukces - przychód został dodany i saldo zostało zaktualizowane
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newBalance:
 *                   type: number
 *                   example: 15000
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: "Wynagrodzenie za pracę"
 *                     amount:
 *                       type: number
 *                       example: 5000
 *                     date:
 *                       type: string
 *                       example: "2025-02-11"
 *                     category:
 *                       type: string
 *                       example: "Salary"
 *       400:
 *         description: Błąd walidacji - niepoprawne dane w ciele zapytania
 *       401:
 *         description: Brak autoryzacji - token niepoprawny lub wygasł
 *       500:
 *         description: Wewnętrzny błąd serwera
 */

/**
 * @swagger
 * /transaction/income:
 *   get:
 *     summary: Pobierz statystyki przychodów
 *     description: Zwraca szczegółowe dane na temat przychodów użytkownika, w tym statystyki miesięczne.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Sukces - zwraca dane dotyczące przychodów i miesięczne statystyki
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 incomes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       description:
 *                         type: string
 *                         example: "Wynagrodzenie za pracę"
 *                       amount:
 *                         type: number
 *                         example: 5000
 *                       date:
 *                         type: string
 *                         example: "2025-02-11"
 *                       category:
 *                         type: string
 *                         example: "Salary"
 *                 monthsStats:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                     example: "N/A"
 *       401:
 *         description: Brak autoryzacji - token niepoprawny lub wygasł
 *       500:
 *         description: Wewnętrzny błąd serwera
 */
router.route("/income")
    .post(isUserLogged, validateAddIncome, transactionsController.addIncome)
    .get(isUserLogged, transactionsController.incomeStats);


/**
 * @swagger
 * /transaction/{transactionId}:
 *   delete:
 *     summary: Usuń transakcję
 *     description: Pozwala zalogowanemu użytkownikowi usunąć transakcję i zaktualizować saldo.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Transactions
 *     parameters:
 *       - name: transactionId
 *         in: path
 *         required: true
 *         description: ID transakcji do usunięcia.
 *         schema:
 *           type: string
 *           example: "60c72b2f9e5b5e2f8a2e5f69"
 *     responses:
 *       200:
 *         description: Sukces - transakcja została usunięta, saldo użytkownika zostało zaktualizowane
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newBalance:
 *                   type: number
 *                   example: 1000.50
 *       400:
 *         description: Brak autoryzacji - brak tokenu lub token jest niepoprawny
 *       401:
 *         description: Brak autoryzacji - token niepoprawny lub wygasł
 *       404:
 *         description: Nie znaleziono transakcji lub użytkownika
 *       500:
 *         description: Wewnętrzny błąd serwera
 */
router.delete("/:transactionId", isUserLogged, validateDeleteTransaction, transactionsController.deleteTransaction);


/**
 * @swagger
 * /transaction/period-data:
 *   get:
 *     summary: Pobierz dane transakcji za dany okres
 *     description: Zwraca dane transakcji (dochody i wydatki) dla zalogowanego użytkownika za określony okres (rok-miesiąc).
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Transactions
 *     parameters:
 *       - name: date
 *         in: query
 *         required: true
 *         description: Data w formacie "YYYY-MM" (np. 2025-01) określająca miesiąc, za który mają zostać pobrane dane transakcji.
 *         schema:
 *           type: string
 *           example: "2025-01"
 *     responses:
 *       200:
 *         description: Sukces - zwraca dane transakcji za wybrany okres (dochody, wydatki).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 incomes:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 3000
 *                     data:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         properties:
 *                           total:
 *                             type: number
 *                             example: 1500
 *                           description1:
 *                             type: number
 *                             example: 500
 *                           description2:
 *                             type: number
 *                             example: 1000
 *                 expenses:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 1500
 *                     data:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         properties:
 *                           total:
 *                             type: number
 *                             example: 800
 *                           description1:
 *                             type: number
 *                             example: 400
 *                           description2:
 *                             type: number
 *                             example: 400
 *       400:
 *         description: Błąd walidacji - niepoprawny format daty lub brak daty w zapytaniu
 *       401:
 *         description: Brak autoryzacji - token niepoprawny lub wygasł
 *       404:
 *         description: Nie znaleziono użytkownika
 *       500:
 *         description: Wewnętrzny błąd serwera
 */
router.get("/period-data", isUserLogged, validatePeriod, transactionsController.transactionsDataForPeriod);


/**
 * @swagger
 * /transaction/income-categories:
 *   get:
 *     summary: Pobierz kategorie dochodów
 *     description: Zwraca dostępne kategorie dochodów dla zalogowanego użytkownika.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Sukces - zwraca dostępne kategorie dochodów
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "SALARY"
 *       400:
 *         description: Brak autoryzacji - brak tokenu lub token jest niepoprawny
 *       401:
 *         description: Brak autoryzacji - token niepoprawny lub wygasł
 *       404:
 *         description: Nie znaleziono użytkownika
 *       500:
 *         description: Wewnętrzny błąd serwera
 */
router.get("/income-categories", isUserLogged, transactionsController.incomeCategories);

/**
 * @swagger
 * /transaction/expense-categories:
 *   get:
 *     summary: Pobierz kategorie wydatków
 *     description: Zwraca dostępne kategorie wydatków dla zalogowanego użytkownika, z wykluczeniem kategorii dochodów.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Sukces - zwraca dostępne kategorie wydatków
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "RENT"
 *       400:
 *         description: Brak autoryzacji - brak tokenu lub token jest niepoprawny
 *       401:
 *         description: Brak autoryzacji - token niepoprawny lub wygasł
 *       404:
 *         description: Nie znaleziono użytkownika
 *       500:
 *         description: Wewnętrzny błąd serwera
 */
router.get("/expense-categories", isUserLogged, transactionsController.expenseCategories);

export default router;