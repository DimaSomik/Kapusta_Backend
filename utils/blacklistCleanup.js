/** usuwanie tokenów z black-list na MongoDB */
import { BlacklistModel } from "../models/blacklist.js";

export const removeExpiredTokens = async () => {
  try {
    const result = await BlacklistModel.deleteMany({ expiresAt: { $lt: new Date() } });
    console.log(`${result.deletedCount} expired tokens removed from blacklist.`);
  } catch (error) {
    console.error("Error removing expired tokens: ", error);
  }
};