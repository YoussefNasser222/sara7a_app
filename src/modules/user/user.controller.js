import { Router } from "express";
import * as userService from "./user.service.js";
import { fileUpload } from "../../utils/multer/multe.local.js";
import { fileUpload as fileUploadCloud } from "../../utils/multer/multer.cloud.js";
import { validationFileType } from "../../middleware/file.validation.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";
const router = Router();
router.delete("/", isAuth, userService.deleteUser);
router.post(
  "/upload-profile-picture",
  isAuth,
  fileUpload({ folder: "profilePicture" }).single("profilePicture"),
  validationFileType(["image/png", "image/jpeg"]),
  userService.uploadProfilePicture
);
router.post(
  "/upload-profile-picture-cloud",
  isAuth,
  fileUploadCloud().single("profilePicture"),
  validationFileType(),
  userService.fileUploadCloud
);
router.get("/", isAuth, userService.getProfile);
export default router;
