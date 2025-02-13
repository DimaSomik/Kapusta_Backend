import Joi from "joi";
import { Categories } from "../transactionCategories.js";

import mongoose from "mongoose";

/** Dodałam zmienną i podmieniłam w kodzie, żeby nie powtarzać ciągle w kodzie */
const MAX_AMOUNT = 1000000000;

/** Dodałam jedną funkcję do walidacji ObjectID, żeby nie powtarzać kodu */

const isValidObjectId = (value, helpers) => {
  const isValid = mongoose.Types.ObjectId.isValid(value);
  if (!isValid) {
    return helpers.message({ custom: "Invalid ObjectId" });
  }
  return value;
};

const schemas = {
  auth: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  }),

  refreshToken: Joi.object({
    sid: Joi.string()
      .custom(isValidObjectId).required(),
  }),

  userBalance: Joi.object({
    newBalance: Joi.number().required().min(1).max(MAX_AMOUNT),
  }),

  addExpsense: Joi.object({
    description: Joi.string().min(1).max(100).required(),
    amount: Joi.number().required().min(1).max(MAX_AMOUNT),
    date: Joi.string()
      .custom((value, helpers) => {
        const dateRegex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
        const isValidDate = dateRegex.test(value);
        if (!isValidDate) {
          return helpers.message({
            custom: "Invalid date. Use format YYYY-MM-DD",
          });
        }
        return value;
      })
      .required(),
    category: Joi.string()
      .required()
      .valid(
        Categories.ALCOHOL,
        Categories.EDUCATION,
        Categories.ENTERTAINMENT,
        Categories.HOUSING,
        Categories.HEALTH,
        Categories.OTHER,
        Categories.PRODUCTS,
        Categories.SPORTS_HOBBIES,
        Categories.TECHNIQUE,
        Categories.TRANSPORT,
        Categories.COMMUNAL_COMMUNICATION
      ),
  }),

  addIncome: Joi.object({
    description: Joi.string().min(1).max(300).required(),
    amount: Joi.number().required().min(1).max(MAX_AMOUNT),
    date: Joi.string()
      .custom((value, helpers) => {
        const dateRegex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
        const isValidDate = dateRegex.test(value);
        if (!isValidDate) {
          return helpers.message({
            custom: "Invalid date. Use format YYYY-MM-DD",
          });
        }
        return value;
      })
      .required(),

    category: Joi.string()
      .required()
      .valid(Categories.SALARY, Categories.ADDITIONAL_INCOME),
  }),

  deleteTransaction: Joi.object({
    transactionId: Joi.string()
    .custom(isValidObjectId).required(),
  }),

  period: Joi.object({
    date: Joi.string()
      .custom((value, helpers) => {
        const dateRegex = /^\d{4}\-(0[1-9]|1[012])$/;
        const isValidDate = dateRegex.test(value);
        if (!isValidDate) {
          return helpers.message({
            custom: "Invalid date. Use format YYYY-MM",
          });
        }
        return value;
      })
      .required(),
  }),
};

const validate =
  (schema, type = "body") =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req[type]);
      next();
    } catch (err) {
      return res.status(400).json({
        message: err.details ? err.details[0].message : err.message,
      });
    }
  };

export const validateAuth = validate(schemas.auth);
export const validateRefreshToken = validate(schemas.refreshToken);
export const validateBalance = validate(schemas.userBalance);
export const validateAddIncome = validate(schemas.addIncome);
export const validateAddExpsense = validate(schemas.addExpsense);
export const validateDeleteTransaction = validate(
  schemas.deleteTransaction,
  "params"
);
export const validatePeriod = validate(schemas.period, "query");
