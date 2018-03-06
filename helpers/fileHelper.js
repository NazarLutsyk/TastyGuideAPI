let fs = require('fs');

module.exports = {
    deleteFiles(files) {
        if (!Array.isArray(files)) {
            files = [files];
        }
        if (files.length > 0) {
            for (let file of files) {
                if (file.indexOf('default.jpg') == -1) {
                    fs.unlink(file, function (err) {
                        if (err) {
                            console.log('From file helper');
                            console.log(err);
                        }
                    });
                }
            }
        } else {
            return;
        }
    }
};