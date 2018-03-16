let fs = require('fs');

module.exports = {
    deleteFiles(files) {
        if (!Array.isArray(files)) {
            files = [files];
        }
        if (files.length > 0) {
            for (let file in files) {
                if (file.indexOf('default.jpg') == -1) {
                    fs.exists(file,function (exists) {
                        if (exists){
                            fs.unlink(file, function (err) {
                                if (err) {
                                    console.log('From file helper');
                                    console.log(err);
                                    throw new Error(err);
                                }
                                return;
                            });
                        }
                    });
                }
            }
        } else {
            return;
        }
    }
};