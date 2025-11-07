import { User } from "../../DB/models/user.model.js";
import { Token } from "../../DB/models/token.model.js";
import fs from "node:fs";
import {
  deleteFolder,
  uploadFileToCloud,
} from "../../utils/cloud/cloudinary.config.js";
// delete user
export const deleteUser = async (req, res, next) => {
  await User.updateOne(
    { _id: req.user._id },
    { deletedAt: Date.now(), credentialUpdatedAt: Date.now() }
  );
  await Token.deleteMany({ user: req.user._id });
  // send response
  res.status(200).json({ message: "user deleted successfully", success: true });
};
// local upload
export const uploadProfilePicture = async (req, res, next) => {
  //  delete old image
  if (req.user.profilePicture) {
    fs.unlinkSync(req.user.profilePicture);
  }
  // update user loginProfile
  const userExist = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePicture: req.file.path,
    },
    { new: true }
  );
  if (!userExist) {
    throw new Error("user not found", { cause: 404 });
  }
  return res.status(200).json({
    message: "upload picture successfully",
    success: true,
    data: userExist,
  });
};

export const fileUploadCloud = async (req, res, next) => {
  const user = req.user;
  const file = req.file;
  // delete old image
  // cloudinary.uploader.destroy(user.profilePicture.public_id);
  // upload image and delete old image
  let folderPath = `sara7a_app/users/${user._id}/profilePicture` ;
  if (user.profilePicture.public_id) {
    folderPath = user.profilePicture.public_id;
  }
  const { secure_url, public_id } = await uploadFileToCloud(
    file.path,
    folderPath
  );
  //  update user to DB
  await User.updateOne(
    { _id: req.user._id },
    { profilePicture: { secure_url, public_id } }
  );
  // send response
  return res.status(200).json({
    message: "uploaded picture successfully",
    success: true,
    data: { secure_url, public_id },
  });
};

export const getProfile = async (req, res, next) => {
  const user = await User.findOne(
    { _id: req.user._id },
    {},
    { populate: [{ path: "messages" }] }
  );
  if (!user) {
    throw new Error("user not found", { cause: 404 });
  }
  return res
    .status(200)
    .json({ message: "done", success: true, data: { user } });
};
