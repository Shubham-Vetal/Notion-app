const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the correct uploads directory (one level up from middleware)
const uploadDir = path.join(__dirname, "../uploads"); // Adjusted path

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

// Create multer instance
const upload = multer({ storage });

module.exports = upload;
