import joi from "joi";
import { generalFields } from "../../middleware/valdition.middleware.js";
export const registerSchema = joi
  .object({
    fullName: generalFields.name.required(),
    email: generalFields.email,
    password: generalFields.password.required(),
    phoneNumber: generalFields.phoneNumber,
    dob: generalFields.dop,
  })
  .or("email", "phoneNumber")
  .required();
export const loginSchema = joi
  .object({
    email: generalFields.email,
    phoneNumber: generalFields.phoneNumber,
    password: generalFields.password.required(),
  })
  .or("email", "phoneNumber");

export const resetPasswordSchema = joi.object({
  email: generalFields.email.required(),
  otp: generalFields.otp.required(),
  newPassword: generalFields.password.required(),
  rePassword: generalFields.rePassword("newPassword").required(),
});
