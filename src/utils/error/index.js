import { Token } from "../../DB/models/token.model.js";
import { generateToken, verifyToken } from "../token/index.js";
export function asyncHandler(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      return next(err);
    });
  };
}

export const globalErrorHandler = async (error, req, res, next) => {
  //   if (req.file) {
  //     fs.unlinkSync(req.file.path);
  //   }
  if (error.message == "jwt expired") {
    const refreshToken = req.headers.refreshtoken;
    const payload = verifyToken(refreshToken);
    const tokenExist = await Token.findOneAndDelete({
      token: refreshToken,
      user: payload.id,
      type: "refresh",
    });
    if (!tokenExist) {
      throw new Error("invalid refresh token", { cause: 401 });
    }
    const newAccessToken = generateToken({
      payload: { id: payload.id },
      options: { expiresIn: "15m" },
    });
    const newRefreshToken = generateToken({
      payload: { id: payload.id },
      options: { expiresIn: "7d" },
    });
    // store in DB
    await Token.create({
      token: newRefreshToken,
      user: payload._id,
      type: "refresh",
    });
    // send response
    return res
      .status(200)
      .json({
        message: "refresh token successfully",
        success: true,
        data: { accessToken : newAccessToken, refreshToken: newRefreshToken },
      });
  }
  return res.status(error.cause || 500).json({
    message: error.message,
    success: false,
    stack: error.stack,
  });
};
