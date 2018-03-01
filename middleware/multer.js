let path = require('path');
let multer = require('multer');

let diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = path.join(__dirname, '../public', 'upload');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        let originalname = file.originalname;
        let separator = originalname.lastIndexOf('.');

        let fileName = originalname.substring(0, separator);
        let extension = originalname.substring(separator);
        let id = Math.floor(Math.random() * (1000000 - 1) + 1);

        let resultFilename = id + '-' + Date.now() + extension;
        cb(null, resultFilename);
    }
});
let upload = multer({
    storage: diskStorage
});

module.exports = upload;