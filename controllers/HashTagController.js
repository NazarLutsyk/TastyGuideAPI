let HashTag = require('../models/HashTag');

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
            res.status(404).send(e.toString());
        }
    },
    async getHashTagById(req, res) {
        let hashTagId = req.params.id;
        try {
            let hashTagQuery = HashTag.find({_id: hashTagId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    hashTagQuery.populate(populateField);
                }
            }
            let hashTag = await hashTagQuery.exec();
            res.json(hashTag);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createHashTag(req, res) {
        try {
            let hashTag = await HashTag.create(req.body);
            res.status(201).json(hashTag);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateHashTag(req, res) {
        let hashTagId = req.params.id;
        try {
            let hashTag = await HashTag.findByIdAndUpdate(hashTagId, req.body,{new : true});
            res.status(201).json(hashTag);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async removeHashTag(req, res) {
        let hashTagId = req.params.id;
        try {
            let hashTag = await HashTag.findById(hashTagId);
            hashTag = await hashTag.remove();
            res.status(204).json(hashTag);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};