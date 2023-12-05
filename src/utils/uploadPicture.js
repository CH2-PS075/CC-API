const multer = require('multer');

// Memory storage keeps the file in buffer
const storage = multer.memoryStorage();

// Define file filter if needed
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // Accept file
    } else {
        cb(null, false); // Reject file
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
};

// Multer upload middleware
const uploadPicture = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter,
});

module.exports = uploadPicture;
