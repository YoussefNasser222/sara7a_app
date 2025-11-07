import multer, { diskStorage } from "multer";
export function fileUpload({allowedType =["image/png" , "image/jpeg"]} = {}) {
  const storage = diskStorage({});
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