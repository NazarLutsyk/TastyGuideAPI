let HashTag = require('../models/HashTag');

module.exports = {
    async getHashTags(req, res) {
        try {
            let hashTags = await HashTag.find({});
            res.json(hashTags);
        } catch (e) {
            res.json(e);
        }
    },
    async getHashTagById(req, res) {
        let hashTagId = req.params.id;
        try {
            let hashTag = await HashTag.findById(hashTagId);
            res.json(hashTag);
        } catch (e) {
            res.json(e);
        }
    },
    async createHashTag(req, res) {
        try {
            let hashTag = await HashTag.create(req.body);
            res.json(hashTag);
        } catch (e) {
            res.json(e);
        }
    },
    async updateHashTag(req, res) {
        let hashTagId = req.params.id;
        try {
            let hashTag = await HashTag.findByIdAndUpdate(hashTagId, req.body,{new : true});
            res.json(hashTag);
        } catch (e) {
            res.json(e);
        }
    },
    async removeHashTag(req, res) {
        let hashTagId = req.params.id;
        try {
            let hashTag = await HashTag.findById(hashTagId);
            hashTag = await hashTag.remove();
            res.json(hashTag);
        } catch (e) {
            res.json(e);
        }
    }
};