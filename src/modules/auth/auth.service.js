import { User } from "../../DB/models/user.model.js";
import { hashPassword, comparePassword } from "../../utils/Hash/index.js";
import { sendMail } from "../../utils/email/index.js";
import { generateOtp } from "../../utils/OTP/index.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { Token } from "../../DB/models/token.model.js";
import { generateToken } from "../../utils/token/index.js";
// register
export const register = async (req, res) => {
  // get data from req
  const { fullName, email, password, phoneNumber, dob } = req.body;
  // check if user exists
  const userExist = await User.findOne({
    $or: [
      {
        $and: [
          { email: { $ne: null } },
          { email: { $exists: true } },
          { email },
        ],
      },
      {
        $and: [
          { phoneNumber: { $exists: true } },
          { phoneNumber: { $ne: null } },
          { phoneNumber },
        ],
      },
    ],
  });
  if (userExist) {
    throw new Error("user exists already", { cause: 409 });
  }
  // create user
  const newUser = await new User({
    fullName,
    email,
    password: hashPassword(password),
    phoneNumber,
    dob,
  });
  // generate otp to verify email
  const { otp, otpExpire } = await generateOtp(15 * 60 * 1000);
  // update user
  newUser.otp = otp;
  newUser.otpExpire = otpExpire;
  // save user
  await newUser.save();
  // send email
  if (email) {
    await sendMail({
      to: email,
      subject: "verify your Email",
      html: `<p>Your Otp To Verify Your Account is ${otp} </p>`,
    });
  }
  // send res
  return res.status(201).json({
    message: "user created successfully",
    success: true,
  });
};
// verify account
export const verifyAccount = async (req, res, next) => {
  // get data from req
  const { otp, email } = req.body;
  // check user
  const userExist = await User.findOne({
    email,
    otp,
    otpExpire: { $gt: Date.now() },
  });
  if (!userExist) {
    throw new Error("otp not valid", { cause: 404 }); // throw error to global handler
  }
  // update user
  userExist.isVerified = true;
  userExist.otp = undefined;
  userExist.otpExpire = undefined;
  // save user
  await userExist.save();
  // send response
  return res
    .status(200)
    .json({ message: "verified email successfully", success: true });
};
// login withgoogle
export const logInWithGoogle = async (req, res, next) => {
  // get data from req
  const { idToken } = req.body;
  // create client
  const client = new OAuth2Client(
    "881537203483-cfa2ok7s8g4cno94n2aj8t4hcovhbenv.apps.googleusercontent.com"
  );
  const ticket = await client.verifyIdToken({ idToken });
  const payload = ticket.getPayload();
  // check user
  let userExist = await User.findOne({ email: payload.email });
  if (!userExist) {
    // create user
    userExist = User.create({
      fullName: payload.name,
      email: payload.email,
      dob: payload.birthdate,
      phoneNumber: payload.phone,
      isVerified: true,
      userAgent: "google",
    });
  }
  // generate Token
  const token = jwt.sign(
    { id: userExist._id, fullName: userExist.fullName },
    "gsafgsfgasfgsfgsagf",
    { expiresIn: "15m" }
  );
  // send response
  res.status(201).json({
    message: "logIn successfully",
    success: true,
    data: { token },
  });
};
// resend otp
export const sendOtp = async (req, res, next) => {
  // get data from req
  const { email } = req.body;
  // generate otp
  const { otp, otpExpire } = generateOtp(5 * 60 * 1000);
  // update user
  const userExist = await User.findOneAndUpdate({ email }, { otp, otpExpire });
  if (!userExist) {
    throw new Error("user not found", { cause: 404 });
  }
  // send mail
  sendMail({
    to: email,
    subject: "new OTP",
    html: `<p>Your Otp To Verify Your Account is ${otp}</p>`,
  });
  // send res
  return res
    .status(200)
    .json({ message: "resend otp successfully", success: true });
};
// log in
export const logIn = async (req, res, next) => {
  // get data from req
  let { email, phoneNumber, password } = req.body;
  // check user exist
  const userExist = await User.findOne({
    $or: [
      {
        $and: [
          { email: { $exists: true } },
          { email: { $ne: null } },
          { email },
        ],
      },
      {
        $and: [
          { phoneNumber: { $exists: true } },
          { phoneNumber: { $ne: null } },
          { phoneNumber },
        ],
      },
    ],
  });
  if (!userExist) {
    throw new Error("invalid email or password", { cause: 401 });
  }
  if (userExist.isVerified == false) {
    throw new Error("account must verify first", { cause: 404 });
  }
  const validatePassword = comparePassword(password, userExist.password);
  if (!validatePassword) {
    throw new Error("invalid password or email", { cause: 401 });
  }
  if (userExist.deletedAt) {
    userExist.deletedAt = undefined;
    await userExist.save();
  }
  // generate Token access
  const accessToken = generateToken({
    payload: { id: userExist._id },
    options: { expiresIn: "1d" },
  });
  // generate token refresh
  const refreshToken = generateToken({
    payload: { id: userExist._id },
    options: { expiresIn: "7d" },
  });
  // store token in DB
  await Token.create({
    token: refreshToken,
    user: userExist._id,
    type: "refresh",
  });
  // send response
  return res.status(200).json({
    message: "log in successfully",
    success: true,
    data: { accessToken, refreshToken },
  });
};
// reset password
export const resetPassword = async (req, res, next) => {
  const { otp, newPassword, email, rePassword } = req.body;
  // check if user exist
  const userExist = await User.findOne({ email });
  if (!userExist) {
    throw new Error("user not found", { cause: 404 });
  }
  // check otp
  if (userExist.otp != otp) {
    throw new Error("otp not valid", { cause: 400 });
  }
  // check otp Expire
  if (userExist.otpExpire < Date.now) {
    throw new Error("otp Expired Please resend otp", { cause: 400 });
  }
  // update user
  userExist.password = hashPassword(newPassword);
  userExist.credentialUpdatedAt = Date.now();
  userExist.otp = undefined;
  userExist.otpExpire = undefined;
  await userExist.save();
  // destroy all refresh token
  await Token.deleteMany({ user: userExist._id, type: "refresh" });
  // send res
  return res
    .status(200)
    .json({ message: "updated password successfully", success: true });
};
// log out
export const logOut = async (req, res, next) => {
  //  get data from req
  const token = req.headers.authorization;
  // store token in DB
  await Token.create({ token: token, user: req.user._id });
  // send res
  return res
    .status(200)
    .json({ message: "user logout successfully", success: true });
};
