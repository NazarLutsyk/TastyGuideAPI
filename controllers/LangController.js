let Lang = require("../models/Lang");
let keysValidator = require("../validators/keysValidator");
let objectHelper = require("../helpers/objectHelper");

module.exports = {
    async getLangs(req, res, next) {
        try {
            res.json(await Lang.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getLangById(req, res, next) {
        let langId = req.params.id;
        try {
            req.query.query._id = langId;
            let lang = await Lang.superfind(req.query);
            res.json(lang[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createLang(req, res, next) {
        try {
            let lang = new Lang(req.body);
            lang = await lang.supersave();
            res.status(201).json(lang);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateLang(req, res, next) {
        let langId = req.params.id;
        try {
            let err = keysValidator.diff(Lang.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
            } else {
                let lang = await Lang.findById(langId);
                if (lang) {
                    let updated = await lang.superupdate(req.body);
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
    async removeLang(req, res, next) {
        let langId = req.params.id;
        try {
            let lang = await Lang.findById(langId);
            if (lang) {
                lang = await lang.remove();
                res.status(204).json(lang);
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