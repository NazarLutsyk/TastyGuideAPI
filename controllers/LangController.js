let Lang = require('../models/Lang');

module.exports = {
    async getLangs(req, res) {
        try {
            let langQuery = Lang
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    langQuery.populate(populateField);
                }
            }
            let langs = await langQuery.exec();
            res.json(langs);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getLangById(req, res) {
        let langId = req.params.id;
        try {
            let langQuery = Lang.find({_id: langId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    langQuery.populate(populateField);
                }
            }
            let lang = await langQuery.exec();
            res.json(lang);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createLang(req, res) {
        try {
            let lang = await Lang.create(req.body);
            res.status(201).json(lang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateLang(req, res) {
        let langId = req.params.id;
        try {
            let lang = await Lang.findByIdAndUpdate(langId, req.body,{new : true});
            res.status(201).json(lang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeLang(req, res) {
        let langId = req.params.id;
        try {
            let lang = await Lang.findById(langId);
            lang = await lang.remove();
            res.status(204).json(lang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};