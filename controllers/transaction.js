import { Categories } from "../transactionCategories.js";
import mongoose from "mongoose";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const calculateMonthlyStats = (transactions, currentYear) => {
  return months.reduce((stats, month, index) => {
    const monthTransactions = transactions.filter(({ date }) => {
      const [year, monthNum] = date.split("-").map(Number);
      return year === currentYear && monthNum === index + 1;
    });

    stats[month] = monthTransactions.length
      ? monthTransactions.reduce((sum, { amount }) => sum + amount, 0)
      : "N/A";

    return stats;
  }, {});
};

export const transactionsController = {
  addTransaction: async (req, res, isIncome) => {
    try {
      const user = req.user;
      const { description, amount, date, category } = req.body;

      const transaction = {
        description,
        amount,
        date,
        category,
        _id: new mongoose.Types.ObjectId(),
        type: isIncome 
          ? "income"
          : "expense",
      };
      user.transactions.push(transaction);
      user.balance += isIncome ? amount : -amount;

      await user.save();
      res
        .status(201)
        .send({ newBalance: user.balance, transaction: transaction });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  
  addExpense: async (req, res) =>
    transactionsController.addTransaction(req, res, false),
  addIncome: async (req, res) =>
    transactionsController.addTransaction(req, res, true),

  deleteTransaction: async (req, res) => {
    try {
      const user = req.user;
      const { transactionId } = req.params;

      const transactionIndex = user.transactions.findIndex(
        (t) => t._id?.toString() === transactionId
      );

      if (transactionIndex === -1) {
        return res.status(404).send({ message: "Transaction not found" });
      }

      const transaction = user.transactions[transactionIndex];
      
      if (![Categories.SALARY, Categories.ADDITIONAL_INCOME].includes(transaction.category)) {
        user.balance += transaction.amount;
      } else {
        user.balance -= transaction.amount;
      }

      user.transactions.splice(transactionIndex, 1);
      await user.save();

      res.status(200).send({ newBalance: user.balance });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  },
  
  getStats: async (req, res, isIncome) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).send({ message: "Unauthorized!" });

      const currentYear = new Date().getFullYear();
      const transactions = user.transactions.filter(({ category }) =>
        isIncome
          ? [Categories.SALARY, Categories.ADDITIONAL_INCOME].includes(category)
          : ![Categories.SALARY, Categories.ADDITIONAL_INCOME].includes(
              category
            )
      );

      res.status(200).send({
        transactions,
        monthsStats: calculateMonthlyStats(transactions, currentYear),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  incomeStats: async (req, res) =>
    transactionsController.getStats(req, res, true),
  expenseStats: async (req, res) =>
    transactionsController.getStats(req, res, false),

  transactionsDataForPeriod: async (req, res) => {
    const user = req.user;
    const { date } = req.query;
    if (!user || !date)
      return res.status(400).send({ message: "Invalid request" });

    const incomesData = {};
    const expensesData = {};
    let incomeTotal = 0;
    let expenseTotal = 0;

    user.transactions
      .filter(({ date: transactionDate }) => transactionDate.startsWith(date))
      .forEach(({ category, description, amount }) => {
        const isIncome = [
          Categories.SALARY,
          Categories.ADDITIONAL_INCOME,
        ].includes(category);
        const data = isIncome ? incomesData : expensesData;

        if (!data[category]) data[category] = { total: 0 };
        if (!data[category][description]) data[category][description] = 0;

        data[category].total += amount;
        data[category][description] += amount;
        isIncome ? (incomeTotal += amount) : (expenseTotal += amount);
      });

    res.status(200).send({
      incomes: { total: incomeTotal, data: incomesData },
      expenses: { total: expenseTotal, data: expensesData },
    });
  },

  incomeCategories: (req, res) => {
    res.status(200).send([Categories.SALARY, Categories.ADDITIONAL_INCOME]);
  },

  expenseCategories: (req, res) => {
    res
      .status(200)
      .send(
        Object.values(Categories).filter(
          (category) =>
            ![Categories.SALARY, Categories.ADDITIONAL_INCOME].includes(
              category
            )
        )
      );
  },
};
