let path = require('path');
let multer = require('multer');
let mkdirp = require('mkdirp');

let diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = path.join(__dirname, '../public', 'upload');
        mkdirp(uploadPath, function (err) {
            if (err) return cb(e);
            else return cb(null, uploadPath);
        });
    },
    filename: function (req, file, cb) {
        let originalname = file.originalname;
        let separator = originalname.lastIndexOf('.');

        let fileName = originalname.substring(0, separator);
        let extension = originalname.substring(separator);
        let id = Math.floor(Math.random() * (1000000 - 1) + 1);

        let resultFilename = id + '-' + Date.now() + extension;
        if (['.jpg','.jpeg','.png','.svg','.gif'].indexOf(extension) != -1) {
            cb(null, resultFilename);
        }else {
            cb(new Error('Bad extension'));
        }
    }
});
let upload = multer({
    storage: diskStorage
});

module.exports = upload;