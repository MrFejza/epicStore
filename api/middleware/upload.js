import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const uploadPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Correct directory path
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage }).array('image', 10); // Ensure field name matches

export default upload;