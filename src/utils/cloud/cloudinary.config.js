import { v2 as cloudinary } from "cloudinary";
import { fileUpload } from "../multer/multer.cloud.js";
cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.API_NAME,
});
// upload one file
export async function uploadFileToCloud(filePath, folderPath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: folderPath,
  });
}

export async function deleteFolder(path) {
  await cloudinary.api.delete_resources_by_prefix(path);
  await cloudinary.api.delete_folder(path);
}
export default cloudinary;
