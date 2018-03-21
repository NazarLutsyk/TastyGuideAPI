let HashTag = require(global.paths.MODELS + '/HashTag');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let objectHelper = require(global.paths.HELPERS + '/objectHelper');

module.exports = {
    async getHashTags(req, res) {
        try {
            let hashTagQuery = HashTag
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    hashTagQuery.populate(populateField);
                }
            }
            let hashTags = await hashTagQuery.exec();
            res.json(hashTags);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getHashTagById(req, res) {
        let hashTagId = req.params.id;
        try {
            let hashTagQuery = HashTag.findOne({_id: hashTagId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    hashTagQuery.populate(populateField);
                }
            }
            let hashTag = await hashTagQuery.exec();
            res.json(hashTag);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createHashTag(req, res) {
        try {
            let err = keysValidator.diff(HashTag.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let hashTag = await HashTag.create(req.body);
                res.status(201).json(hashTag);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateHashTag(req, res) {
        let hashTagId = req.params.id;
        try {
            let err = keysValidator.diff(HashTag.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let hashTag = await HashTag.findById(hashTagId);
                if (hashTag) {
                    objectHelper.load(lang, req.body);
                    let updated = await hashTag.save();
                    res.status(201).json(updated);
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeHashTag(req, res) {
        let hashTagId = req.params.id;
        try {
            let hashTag = await HashTag.findById(hashTagId);
            if (hashTag) {
                hashTag = await hashTag.remove();
                res.status(204).json(hashTag);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
};