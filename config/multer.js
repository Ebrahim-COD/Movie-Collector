const multer = require("multer");
const path = require("path");

// Define storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    // Use the original file name with a unique prefix
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create multer instance with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (5MB)
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and GIF files are allowed.")
    );
  },
});

module.exports = upload;
