let fs = require('fs');

module.exports = {
    deleteFiles(files) {
        if (!Array.isArray(files)) {
            files = [files];
        }
        if (files.length > 0) {
            for (let file in files) {
                fs.exists(files[file].toString(), function (exists) {
                    if (exists) {
                        fs.unlink(files[file].toString(), function (err) {
                            if (err) {
                                throw new Error(err);
                            }
                            return;
                        });
                    }
                });
            }
        } else {
            return;
        }
    }
};