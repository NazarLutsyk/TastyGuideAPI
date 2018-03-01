let Image = require('../models/Image');
let fileHelper = require('../helpers/fileHelper');
let path = require('path');

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
            res.status(404).send(e.toString());
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
            res.status(404).send(e.toString());
        }
    },
    async createImage(req, res) {
        try {
            if (req.files) {
                let result = [];
                for (let file of req.files) {
                    let image = new Image({
                        name : file.filename,
                        path : file.path,
                        extension : path.extname(file.filename)
                    });
                    result.push(image);
                }
                let response = [];
                for (let image of result) {
                    response.push(await image.save());
                }
                res.status(201).json(response);
            }
        } catch (e) {
            if (req.files){
                for (let file of req.files) {
                    fileHelper.deleteFiles(file.path)
                }
            }
            res.status(400).send(e.toString());
        }
    },
    async removeImage(req, res) {
        let imageId = req.params.id;
        try {
            let image = await Image.findById(imageId);
            image = await image.remove();
            res.status(204).json(image);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};