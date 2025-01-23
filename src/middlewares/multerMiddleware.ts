import multer from "multer";
import { nextTick } from "process";


//create a multer Storage
const tempStorage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'src/uploads');
    },
    filename(req, file, callback) {
        callback(null, Date.now() + "--" + file.originalname);
    }
})


export const upload = multer({ storage: tempStorage });