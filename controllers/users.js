export const usersController = {
    updateUserBalance: async (req, res) => {
        const user = req.user;
        const { newBalance } = req.body;
        
        if (typeof newBalance !== 'number') {
            return res.status(400).send({ message: "New balance must be a number" });
        }

        (user).balance = newBalance;
        await user?.save();

        return res.status(200).send({ newBalance });
    },

    getUserData: (req, res) => {
        const user = req.user;
        
        return res.status(200).send({
          email: user?.email,
          balance: user?.balance,
          transactions: user?.transactions,
        });
      }

}