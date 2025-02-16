import express from "express";

import { connectDB } from "./db.js";
import authRouter from './routes/api/auth.js';
import userRouter from './routes/api/user.js';
import transactionRouter from './routes/api/transaction.js';
import setupSwagger from './swagger.js';

import cors from "cors";

import { removeExpiredTokens } from './utils/blacklistCleanup.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);

connectDB();

setupSwagger(app);

/** Odpalanie funkcji czyszczenia tokenów */
setInterval(removeExpiredTokens, 60 * 1000);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;