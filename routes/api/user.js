import { Router } from "express";

import { validateBalance } from "../../middlewares/validation.js";
  
import { usersController } from "../../controllers/users.js";
import { isUserLogged } from "../../middlewares/isUserLogged.js";

const router = Router();

/**
 * @swagger
 * /user/balance:
 *   patch:
 *     summary: Aktualizuj saldo użytkownika
 *     description: Pozwala zalogowanemu użytkownikowi zaktualizować swoje saldo.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newBalance:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 1000000000
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Sukces - zwraca zaktualizowane saldo użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newBalance:
 *                   type: number
 *                   example: 5000
 *       400:
 *         description: Błąd walidacji - nowa wartość salda jest niepoprawna
 *       401:
 *         description: Brak autoryzacji - token niepoprawny lub wygasł
 *       404:
 *         description: Nie znaleziono użytkownika lub sesji
 *       500:
 *         description: Wewnętrzny błąd serwera
*/

router.patch("/balance", isUserLogged, validateBalance, usersController.updateUserBalance);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Pobierz dane użytkownika
 *     description: Pobiera dane zalogowanego użytkownika, w tym email, saldo oraz historię transakcji.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Sukces - zwraca dane użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 balance:
 *                   type: number
 *                   example: 1000.50
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "txn_12345"
 *                       amount:
 *                         type: number
 *                         example: -50.25
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-02-11T12:34:56Z"
 *       400:
 *         description: Brak tokena - nagłówek Authorization nie został dostarczony
 *       401:
 *         description: Brak autoryzacji - token niepoprawny lub wygasł
 *       404:
 *         description: Nie znaleziono użytkownika lub sesji
 *       500:
 *         description: Wewnętrzny błąd serwera
 */
router.get("/", isUserLogged, usersController.getUserData);

export default router;