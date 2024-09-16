const multer = require('multer');
const path = require('path');

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
