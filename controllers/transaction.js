import { Categories } from "../transactionCategories.js";

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
]

export const transactionsController = {
    addExpense: async (req, res) => {
        const user = req.user;
        const { description, amount, date, category } = req.body;
      
        const transaction = { description, amount, date, category };
        user?.transactions.push(transaction);
        user.balance -= amount;
      
        await user?.save();
        res.status(201).send({ newBalance: user.balance, transaction });
    },

    addIncome: async (req, res) => {
      const user = req.user;
      const { description, amount, date, category } = req.body;
  
      if (!amount || typeof amount !== "number") {
        return res.status(400).send({ message: "Amount is required and must be a number" });
      }
  
      const transaction = { description, amount, date, category };
      user.transactions.push(transaction);
      user.balance += amount;
      
      await user.save();
  
      return res.status(201).send({
        newBalance: user.balance,
        transaction: user.transactions[user.transactions.length - 1],
      });
    },

    deleteTransaction: async (req, res) => {
        try {
            const user = req.user;
            const { transactionId } = req.params;
    
            const transactionIndex = user.transactions.findIndex(
                t => t._id?.toString() === transactionId
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

      incomeStats: async (req, res) => {
        const user = req.user;
        if (!user) return res.status(401).send({ message: "Unauthorized" });
      
        const incomes = user.transactions.filter(({ category }) =>
          [Categories.SALARY, Categories.ADDITIONAL_INCOME].includes(category)
        );
      
        const currentYear = new Date().getFullYear();
        const monthsStats = {};
      
        months.forEach((month, index) => {
          const monthTransactions = incomes.filter(({ date }) => {
            const [year, monthNum] = date.split("-").map(Number);
            return year === currentYear && monthNum === index + 1;
          });
      
          monthsStats[month] = monthTransactions.length
            ? monthTransactions.reduce((sum, { amount }) => sum + amount, 0)
            : "N/A";
        });
      
        res.status(200).send({ incomes, monthsStats });
      },

      expenseStats: async (req, res) => {
        const user = req.user;
        if (!user) return res.status(401).send({ message: "Unauthorized" });
      
        const currentYear = new Date().getFullYear();
      
        const expenses = user.transactions.filter(
          ({ category }) => ![Categories.SALARY, Categories.ADDITIONAL_INCOME].includes(category)
        );
      
        const monthsStats = {};
      
        months.forEach((month, index) => {
          const monthTransactions = expenses.filter(({ date }) => {
            const [year, monthNum] = date.split("-").map(Number);
            return year === currentYear && monthNum === index + 1;
          });
      
          monthsStats[month] = monthTransactions.length
            ? monthTransactions.reduce((sum, { amount }) => sum + amount, 0)
            : "N/A";
        });
      
        res.status(200).send({ expenses, monthsStats });
      },

      transactionsDataForPeriod: async (req, res) => {
        const user = req.user;
        const { date } = req.query;
        if (!user || !date) return res.status(400).send({ message: "Invalid request" });
      
        const incomesData = {};
        const expensesData = {};
        let incomeTotal = 0;
        let expenseTotal = 0;
      
        user.transactions
          .filter(({ date: transactionDate }) => transactionDate.startsWith(date))
          .forEach(({ category, description, amount }) => {
            const isIncome = [Categories.SALARY, Categories.ADDITIONAL_INCOME].includes(category);
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
        })
    },

    incomeCategories: (req, res) => {
        res.status(200).send([Categories.SALARY, Categories.ADDITIONAL_INCOME]);
    },

    expenseCategories: (req, res) => {
        res.status(200).send(
          Object.values(Categories).filter(
            (category) => ![Categories.SALARY, Categories.ADDITIONAL_INCOME].includes(category)
          )
        );
    }

};