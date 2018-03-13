let Image = require(global.paths.MODELS + '/Image');
let fileHelper = require(global.paths.HELPERS + '/fileHelper');
let upload = require(global.paths.MIDDLEWARE + '/multer');
let path = require('path');
upload = upload.array('images');


module.exports = {
    async getImages(req, res) {
        try {
            let images = Image
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    images.populate(populateField);
                }
            }
            let bonuseMultilang = await images.exec();
            res.json(bonuseMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getImageById(req, res) {
        let imageId = req.params.id;
        try {
            let imageQuery = Image.find({_id: imageId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    imageQuery.populate(populateField);
                }
            }
            let image = await imageQuery.exec();
            res.json(image);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createImage(req, res) {
        upload(req, res,async function (err) {
            if (err && !req.files) {
                return res.status(400).send(err.toString());
            }else {
                let result = [];
                for (let file of req.files) {
                    let image = new Image({
                        name: file.filename,
                        path: file.path,
                        extension: path.extname(file.filename)
                    });
                    result.push(image);
                }
                let response = [];
                for (let image of result) {
                    response.push(await image.save());
                }
                res.status(201).json(response);
            }
        });
    },
    async removeImage(req, res) {
        let imageId = req.params.id;
        try {
            let image = await Image.findById(imageId);
            if (image) {
                image = await image.remove();
                res.status(204).json(image);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};