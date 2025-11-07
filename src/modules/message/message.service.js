import { Message } from "../../DB/models/message.model.js";
import { uploadFileToCloud } from "../../utils/cloud/cloudinary.config.js";

// send message
export const sendMessage = async (req, res, next) => {
  // get data from req
  const { content } = req.body;
  const { receiver } = req.params;
  const file = req.file;
  const folderPath = `sara7a_app/message/${receiver}/files`;
  //   upload into cloud
  const { secure_url, public_id } = await uploadFileToCloud(
    file.path,
    folderPath
  );
  //   store in DB
  await Message.create({
    receiver,
    content,
    attachments: { secure_url, public_id },
    sender: req.user?._id,
  });
  //   return res
  return res.status(201).json({
    message: "message sent successfully",
    success: true,
    data: { secure_url, public_id },
  });
};

export const getSpecificMessage = async (req, res, next) => {
  // get data from req
  const id = req.params.id;
  const message = await Message.findOne(
    { _id: id, receiver: req.user._id },
    {},
    {
      populate: [
        {
          path: "receiver",
          select:
            "-password -credentialUpdatedAt -__v -updatedAt -deletedAt -isVerified -userAgent",
        },
      ],
    }
  );
  if (!message) {
    throw new Error("message not found", { cause: 404 });
  }
  // send res
  return res
    .status(200)
    .json({ message: "done", success: true, data: { message } });
};
