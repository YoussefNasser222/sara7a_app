import joi from "joi";
import { generalFields } from "../../middleware/valdition.middleware.js";
export const sendMessageSchema = joi.object({
  content: joi.string().min(5).max(1000),
  receiver: generalFields.objectId.required(),
  sender: generalFields.objectId,
});

export const getMessageSchema = joi.object({
  id: generalFields.objectId.required(),
});
