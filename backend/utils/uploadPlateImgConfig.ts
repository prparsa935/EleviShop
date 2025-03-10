import { diskStorage } from "multer";
import multer from "multer";
import { mainDir } from "../server.js";
import fs from "fs";
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, mainDir + "/public/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "." +
      file.mimetype.split("/")[1];
    cb(null, file.fieldname + uniqueSuffix);
  },
});

// set sizefilter later
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  // add filesize filter later

  fileFilter: (req, file, cb) => {
    // file.mimetype.split('/')[0] == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"
    if (file.mimetype.split("/")[0] == "image") {
      cb(null, true);
    } else {
      fs.unlink(file.path, (error) => {
        if (error) {
        }
        cb(null, false);
      });
    }
  },
});
export default upload;
