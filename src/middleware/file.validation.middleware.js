import fs from "node:fs";
import {fileTypeFromBuffer} from "file-type";
export const validationFileType = (allowedType = ["image/png", "image/jpeg"]) => {
    return async (req, res, next) => {
        // get file path
        const filePath = req.file.path;
        // file exist
          if (!req.file || !req.file.path) {
        return next(new Error("File is required"));
      }
        // read the file and return buffer
        const buffer = fs.readFileSync(filePath);
        const type = await fileTypeFromBuffer(buffer);
        if (!type || !allowedType.includes(type.mime)) {
            return next(new Error("invalid file format"))
        }
        next();
    };  
};