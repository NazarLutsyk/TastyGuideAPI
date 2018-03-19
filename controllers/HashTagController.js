let HashTag = require(global.paths.MODELS + '/HashTag');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

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
                let hashTag = new HashTag(req.body);
                hashTag = await hashTag.supersave();
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
                    let updated = await hashTag.superupdate(req.body);
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
    async addPlace(req, res) {
        let modelId = req.params.id;
        let placeId = req.params.idPlace;
        try {
            if (modelId && placeId) {
                let hashTag = await HashTag.findById(modelId);
                await hashTag.superupdate(HashTag,{
                    places: hashTag.places.concat(placeId)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removePlace(req, res) {
        let modelId = req.params.id;
        let placeId = req.params.idPlace;
        try {
            if (modelId && placeId) {
                let hashTag = await HashTag.findById(modelId);
                hashTag.places.splice(hashTag.places.indexOf(placeId),1);
                await hashTag.superupdate(HashTag,{
                    places: hashTag.places
                });
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};