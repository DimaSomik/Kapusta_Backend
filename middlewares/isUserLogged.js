import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.js';
import { SessionModel } from '../models/session.js';

export const isUserLogged = async (req, res, next) => {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader) {
      const accessToken = authorizationHeader.replace("Bearer ", "");
      try {
        const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

        const user = await UserModel.findById(payload.uid).select('-password'); /** Dodałam usuwanie hasła, żebyśmy przez przypadek go nie zwrócli */
        /** Podzieliłam zwrotkę błędów; moim zdaniem będzie lepiej jeśli dostaniemy dokładną zwrotkę co jest nie tak; Invalid user or session jest trochę zbyt ogólnikowe */
        if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

        const session = await SessionModel.findById(payload.sid);
        if (!session) {
          return res.status(404).send({ message: "Invalid session" });
        }

        req.user = user;
        req.session = session;

        next();
      } catch (err) {
        return res.status(401).send({ message: "Unauthorized" });
      }
    } else {
      return res.status(400).send({ message: "No token provided" });
    }
  }