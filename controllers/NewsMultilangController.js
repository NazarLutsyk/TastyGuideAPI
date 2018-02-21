let NewsMultilang = require('../models/NewsMultilang');

module.exports = {
    async getNewsMultilangs(req, res) {
        try {
            let newsMultilangs = await NewsMultilang.find({});
            res.json(newsMultilangs);
        } catch (e) {
            res.json(e);
        }
    },
    async getNewsMultilangById(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilang = await NewsMultilang.findById(newsMultilangId);
            res.json(newsMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async createNewsMultilang(req, res) {
        try {
            let newsMultilang = await NewsMultilang.create(req.body);
            res.json(newsMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async updateNewsMultilang(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilang = await NewsMultilang.findByIdAndUpdate(newsMultilangId, req.body,{new : true});
            res.json(newsMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async removeNewsMultilang(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilang = await NewsMultilang.findById(newsMultilangId);
            newsMultilang = await newsMultilang.remove();
            res.json(newsMultilang);
        } catch (e) {
            res.json(e);
        }
    }
};