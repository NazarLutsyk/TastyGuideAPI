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
                    if (exists) {
                        log(`File exists ${filename}`);
                        fs.unlink(filename, function (err) {
                            if (err) {
                                throw new Error(err);
                            }
                            log(`Delete file ${filename}`);
                            return;
                        });
                    }
                    log(`File doesn't exists ${filename}`);
                });
            }
        } else {
            return;
        }
    }
};