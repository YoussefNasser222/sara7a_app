import jwt from "jsonwebtoken";
export const verifyToken = (token, secretKey = "gsafgsfgasfgsfgsagf") => {
  return jwt.verify(token, secretKey);
};

export const generateToken = ({
  payload,
  secretKey = "gsafgsfgasfgsfgsagf",
  options = { expiresIn: "15m" },
} = {}) => {
  return jwt.sign(payload, secretKey, options);
};
