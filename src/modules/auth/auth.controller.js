import { Router } from "express";
import * as authService from "./auth.service.js";
import { isValid } from "../../middleware/valdition.middleware.js";
import * as authValidation from "./auth.validation.js";
import { fileUpload } from "../../utils/multer/multe.local.js";
import { isAuth } from "../../middleware/auth.middleware.js";
const router = Router();
router.post(
  "/register",
  fileUpload().none(),
  isValid(authValidation.registerSchema),
  authService.register
);
router.post("/login", isValid(authValidation.loginSchema), authService.logIn);
router.post("/verify-account", authService.verifyAccount);
router.post("/send-otp", authService.sendOtp);
router.post("/google-login", authService.logInWithGoogle);
router.patch(
  "/reset-password",
  isValid(authValidation.resetPasswordSchema),
  authService.resetPassword
);
router.post("/logout" ,isAuth ,authService.logOut)
export default router;
