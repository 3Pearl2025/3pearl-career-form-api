import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Fix: Properly decode the original filename to handle Arabic characters
    const originalName = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    const uniqueName = `${Date.now()}-${originalName}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Only PDF, JPG, or PNG allowed"));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter,
});

export default upload;
