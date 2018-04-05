let HashTag = require('../models/HashTag');
let keysValidator = require('../validators/keysValidator');
let objectHelper = require('../helpers/objectHelper');

module.exports = {
    async getHashTags(req, res,next) {
        try {
            res.json(await HashTag.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getHashTagById(req, res,next) {
        let hashTagId = req.params.id;
        try {
            req.query.target.query._id = hashTagId;
            res.json(await HashTag.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createHashTag(req, res,next) {
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
            e.status = 400;
            return next(e);
        }
    },
    async updateHashTag(req, res,next) {
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
                } else {
                    let e = new Error();
                    e.message = "Not found";
                    e.status = 404;
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeHashTag(req, res,next) {
        let hashTagId = req.params.id;
        try {
            let hashTag = await HashTag.findById(hashTagId);
            if (hashTag) {
                hashTag = await hashTag.remove();
                res.status(204).json(hashTag);
            } else {
                let e = new Error();
                e.message = "Not found";
                e.status = 404;
                return next(e);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
};