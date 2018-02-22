let Lang = require('../models/Lang');

module.exports = {
    async getLangs(req, res) {
        try {
            let langs = await Lang.find({});
            res.json(langs);
        } catch (e) {
            res.json(e);
        }
    },
    async getLangById(req, res) {
        let langId = req.params.id;
        try {
            let lang = await Lang.findById(langId);
            res.json(lang);
        } catch (e) {
            res.json(e);
        }
    },
    async createLang(req, res) {
        try {
            let lang = await Lang.create(req.body);
            res.json(lang);
        } catch (e) {
            res.json(e);
        }
    },
    async updateLang(req, res) {
        let langId = req.params.id;
        try {
            let lang = await Lang.findByIdAndUpdate(langId, req.body,{new : true});
            res.json(lang);
        } catch (e) {
            res.json(e);
        }
    },
    async removeLang(req, res) {
        let langId = req.params.id;
        try {
            let lang = await Lang.findById(langId);
            lang = await lang.remove();
            res.json(lang);
        } catch (e) {
            res.json(e);
        }
    }
};