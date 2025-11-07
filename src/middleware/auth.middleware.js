import { verifyToken } from "../utils/token/index.js";
import { User } from "../DB/models/user.model.js";
import { Token } from "../DB/models/token.model.js";

export const isAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  // check token
  if (!token) {
    return next(new Error("token is required", { cause: 401 }));
  }
  // check token in system
  const payload = verifyToken(token);
  // check block token in DB
  const blockedToken = await Token.findOne({ token, type: "access" });
  if (blockedToken) {
    return next(new Error("invalid Token", { cause: 400 }));
  }
  const userExist = await User.findById(payload.id);
  if (!userExist) {
    return next(new Error("user not found", { cause: 404 }));
  }
  // check token credential
  if (userExist.credentialUpdatedAt > new Date(payload.iat * 1000)) {
    throw new Error("token Expired", { cause: 401 });
  }
  req.user = userExist;
  next();
};
