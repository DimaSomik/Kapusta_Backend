import { Router } from "express";

import { validateAuth, validateRefreshToken } from "../../middlewares/validation.js";
  
import { authController } from "../../controllers/auth.js";
import { isUserLogged } from "../../middlewares/isUserLogged.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Rejestracja nowego użytkownika
 *     description: Tworzy nowego użytkownika na podstawie podanego emaila i hasła.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "securePass123"
 *     responses:
 *       201:
 *         description: Sukces - użytkownik został zarejestrowany
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *       400:
 *         description: Błąd walidacji - niepoprawny email lub hasło
 *       409:
 *         description: Konflikt - użytkownik o podanym emailu już istnieje
 *       500:
 *         description: Wewnętrzny błąd serwera
 */

router.post("/register", validateAuth, authController.register);


 /**
 * @swagger
 *  /auth/login:
 *   post:
 *     summary: Logowanie użytkownika
 *     description: Loguje użytkownika na podstawie podanego emaila i hasła, zwracając tokeny dostępowe.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securePass123"
 *     responses:
 *       200:
 *         description: Sukces - zwraca tokeny dostępowe oraz dane użytkownika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 sid:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109cb"
 *                 userData:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     balance:
 *                       type: number
 *                       example: 1000.50
 *                     id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "txn_12345"
 *                           amount:
 *                             type: number
 *                             example: -50.25
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-02-11T12:34:56Z"
 *       400:
 *         description: Błąd walidacji - niepoprawny email lub hasło
 *       403:
 *         description: Brak dostępu - niepoprawny email lub hasło
 *       500:
 *         description: Wewnętrzny błąd serwera
 */

router.post("/login", validateAuth, authController.login);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Wylogowanie użytkownika
 *     description: Usuwa aktywną sesję użytkownika, wylogowując go z systemu.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Sukces - użytkownik został pomyślnie wylogowany
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out."
 *       400:
 *         description: Błąd - nie znaleziono aktywnej sesji
 *       500:
 *         description: Wewnętrzny błąd serwera
 */

router.post("/logout", isUserLogged, authController.logout);


/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Odświeżenie tokenów
 *     description: Generuje nowy token dostępu i odświeżający na podstawie ważnej sesji.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sid:
 *                 type: string
 *                 description: Identyfikator sesji użytkownika (MongoDB ObjectId)
 *                 example: "60d0fe4f5311236168a109cb"
 *     responses:
 *       200:
 *         description: Sukces - zwraca nowe tokeny dostępowe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newAccessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 newRefreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 newSid:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109cc"
 *       400:
 *         description: Błąd - brak tokena w nagłówku żądania
 *       401:
 *         description: Brak dostępu - nieautoryzowany użytkownik
 *       404:
 *         description: Błąd - nieprawidłowa sesja lub użytkownik
 *       500:
 *         description: Wewnętrzny błąd serwera
 */

router.post("/refresh", validateRefreshToken, authController.refreshToken)

export default router;