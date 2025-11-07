import fs from "node:fs";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
export function fileUpload({allowedType =["image/png" , "image/jpeg"] , folder} = {}) {
  const storage = diskStorage({
    destination: (req , file , cb)=>{
      let des = `./upload/${req.user._id}/${folder}`;
      if(!fs.existsSync(des)){
        fs.mkdirSync(des , {recursive : true});
      }
      cb(null , des);
    },
    filename: (req, file, cb) => {
        cb(null ,nanoid(5) +'-'+file.originalname);
    },
  });
  const fileFilter = (req , file , cb )=>{
        if(allowedType.includes(file.mimetype)){
          cb(null , true);
        }
        else {
          cb (new Error("invalid file format"));
        }
  }
 return multer({ storage , fileFilter });
}