import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.js';
import { SessionModel } from '../models/session.js';

export const isUserLogged = async (req, res, next) => {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader) {
      const accessToken = authorizationHeader.replace("Bearer ", "");
      try {
        const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

        const user = await UserModel.findById(payload.uid);
        const session = await SessionModel.findById(payload.sid);

        if (!user || !session) {
          return res.status(404).send({ message: "Invalid user or session" });
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