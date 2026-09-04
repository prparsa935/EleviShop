import { diskStorage } from "multer";
import multer from "multer";
import { mainDir } from "../server.js";
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, mainDir + "/public/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            "." +
            file.mimetype.split("/")[1];
        cb(null, file.fieldname + uniqueSuffix);
    },
});
const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
});
export default upload;
