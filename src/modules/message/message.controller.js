import { Router } from "express";
import * as messageService from "./message.service.js";
import { fileUpload } from "../../utils/multer/multer.cloud.js";
import { getMessageSchema, sendMessageSchema } from "./message.validation.js";
import { isValid } from "../../middleware/valdition.middleware.js";
import { isAuth } from "../../middleware/auth.middleware.js";
const router = Router();
// anonyms message
router.post(
  "/:receiver",
  fileUpload().single("attachments"),
  isValid(sendMessageSchema),
  messageService.sendMessage
);
// un anonyms message
router.post(
  "/:receiver/sender",
  isAuth,
  fileUpload().single("attachments"),
  isValid(sendMessageSchema),
  messageService.sendMessage
);

router.get(
  "/:id",
  isAuth,
  isValid(getMessageSchema),
  messageService.getSpecificMessage
);
export default router;
