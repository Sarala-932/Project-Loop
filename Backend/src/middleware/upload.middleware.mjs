import multer from "multer";
import createError from "../utils/createError.mjs";

// Use memory storage so the file is never written to disk.
const storage = multer.memoryStorage();

// File filter to only allow CSV files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
        cb(null, true);
    } else {
        cb(createError("Only CSV files are allowed", 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

export default upload;
