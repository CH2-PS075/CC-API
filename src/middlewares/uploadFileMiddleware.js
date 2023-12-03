// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const path = require('path');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    }
    return cb('Error: Images Only!');
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './public/assets/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
}).single('picture');

module.exports = upload;
