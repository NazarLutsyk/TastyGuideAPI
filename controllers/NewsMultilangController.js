let NewsMultilang = require('../models/NewsMultilang');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getNewsMultilangs(req, res,next) {
        try {
            res.json(await NewsMultilang.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getNewsMultilangById(req, res,next) {
        let newsMultilangId = req.params.id;
        try {
            req.query.target.query._id = newsMultilangId;
            let newsMultilang = await NewsMultilang.superfind(req.query);
            res.json(newsMultilang[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createNewsMultilang(req, res,next) {
        try {
            let err = keysValidator.diff(NewsMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let newsMultilang = new NewsMultilang(req.body);
                newsMultilang = await newsMultilang.supersave();
                res.status(201).json(newsMultilang);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateNewsMultilang(req, res,next) {
        let newsMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(NewsMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let newsMultilang = await NewsMultilang.findById(newsMultilangId);
                if (newsMultilang) {
                    let updated = await newsMultilang.superupdate(req.body);
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
    async removeNewsMultilang(req, res,next) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilang = await NewsMultilang.findById(newsMultilangId);
            if (newsMultilang) {
                newsMultilang = await newsMultilang.remove();
                res.status(204).json(newsMultilang);
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
    }
};