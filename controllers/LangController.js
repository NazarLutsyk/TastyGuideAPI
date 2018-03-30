let Lang = require('../models/Lang');
let keysValidator = require('../validators/keysValidator');
let objectHelper = require('../helpers/objectHelper');

module.exports = {
    async getLangs(req, res,next) {
        try {
            let langQuery;
            if (req.query.aggregate) {
                langQuery = Lang.aggregate(req.query.aggregate);
            } else {
                langQuery = Lang
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        langQuery.populate(populateField);
                    }
                }
            }
            let langs = await langQuery.exec();
            res.json(langs);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getLangById(req, res,next) {
        let langId = req.params.id;
        try {
            let langQuery = Lang.findOne({_id: langId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    langQuery.populate(populateField);
                }
            }
            let lang = await langQuery.exec();
            res.json(lang);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createLang(req, res,next) {
        try {
            let lang = await Lang.create(req.body);
            res.status(201).json(lang);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateLang(req, res,next) {
        let langId = req.params.id;
        try {
            let err = keysValidator.diff(Lang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let lang = await Lang.findById(langId);
                if (lang) {
                    objectHelper.load(lang, req.body);
                    let updated = await lang.save();
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
    async removeLang(req, res,next) {
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