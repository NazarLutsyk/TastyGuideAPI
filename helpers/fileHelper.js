let fs = require('fs');

module.exports = {
    deleteFiles(files) {
        if (!Array.isArray(files)) {
            files = [files];
        }
        if (files.length > 0) {
            for (let file in files) {
                let fileName = files[file].toString();
                fs.exists(fileName, function (exists) {
                    if (exists && fileName.indexOf('default.jpg') < 0) {
                        log(`File exists ${fileName}`);
                        fs.unlink(fileName, function (err) {
                            if (err) {
                                throw new Error(err);
                            }
                            log(`Delete file ${fileName}`);
                            return;
                        });
                    }
                    log(`File doesn't exists ${fileName}`);
                });
            }
        } else {
            return;
        }
    }
};