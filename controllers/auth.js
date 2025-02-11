import { UserModel } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SessionModel } from "../models/session.js";

export const authController = {
  register: async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: `User with ${email} email already exists` });
    }

    const passwordHash = await bcrypt.hash(password, Number(process.env.HASH_POWER));

    const newUser = await UserModel.create({
      email,
      passwordHash,
      originUrl: req.headers.origin || '-',
      balance: 0,
      transactions: [],
    });

    return res.status(201).send({
      email,
      id: newUser._id,
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).send({ message: `User with ${email} email doesn't exist` });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(403).send({ message: "Password is wrong" });
    }

    const newSession = await SessionModel.create({
      uid: user._id,
    });

    const accessToken = jwt.sign(
      { uid: user._id, sid: newSession._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME }
    );

    const refreshToken = jwt.sign(
      { uid: user._id, sid: newSession._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME }
    );

    return res.status(200).send({
      accessToken,
      refreshToken,
      sid: newSession._id,
      userData: {
        email: user.email,
        balance: user.balance,
        id: user._id,
        transactions: user.transactions,
      },
    });
  },

  logout: async (req, res) => {
    try {
      const currentSession = req.session;
      const result = await SessionModel.deleteOne({ _id: currentSession._id });
  
      if (result.deletedCount === 0) {
        return res.status(400).send({ message: "Failed to log out. No session found." });
      }
  
      return res.status(200).send({ message: "Successfully logged out." });
    } catch (error) {
      return res.status(500).send({ message: "An error occurred while logging out." });
    }
  },

  refreshToken: async (req, res) => {
    const authorizationHeader = req.get("Authorization");
    
    if (!authorizationHeader) {
      return res.status(400).send({ message: "No token provided" });
    }
  
    const activeSession = await SessionModel.findById(req.body.sid);
    if (!activeSession) {
      return res.status(404).send({ message: "Invalid session" });
    }
  
    const reqRefreshToken = authorizationHeader.replace("Bearer ", "");
    let payload;
  
    try {
      payload = jwt.verify(reqRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      await SessionModel.findByIdAndDelete(req.body.sid);
      return res.status(401).send({ message: "Unauthorized" });
    }
  
    const user = await UserModel.findById(payload.uid);
    const session = await SessionModel.findById(payload.sid);
  
    if (!user) {
      return res.status(404).send({ message: "Invalid user" });
    }
    if (!session) {
      return res.status(404).send({ message: "Invalid session" });
    }
  
    await SessionModel.findByIdAndDelete(payload.sid);
  
    const newSession = await SessionModel.create({ uid: user._id });
  
    const newAccessToken = jwt.sign(
      { uid: user._id, sid: newSession._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME }
    );
  
    const newRefreshToken = jwt.sign(
      { uid: user._id, sid: newSession._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME }
    );
  
    return res.status(200).send({ newAccessToken, newRefreshToken, newSid: newSession._id });
  }
};
