let NewsMultilang = require('../models/NewsMultilang');

module.exports = {
    async getNewsMultilangs(req, res) {
        try {
            let newsMultilangQuery = NewsMultilang
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    newsMultilangQuery.populate(populateField);
                }
            }
            let newsMultilangs = await newsMultilangQuery.exec();
            res.json(newsMultilangs);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getNewsMultilangById(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilangQuery = NewsMultilang.find({_id: newsMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    newsMultilangQuery.populate(populateField);
                }
            }
            let newsMultilang = await newsMultilangQuery.exec();
            res.json(newsMultilang);
        }catch (e){
            res.send(e.toString());
        }
    },
    async createNewsMultilang(req, res) {
        try {
            let newsMultilang = await NewsMultilang.create(req.body);
            res.json(newsMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateNewsMultilang(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilang = await NewsMultilang.findByIdAndUpdate(newsMultilangId, req.body, {new: true});
            res.json(newsMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeNewsMultilang(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilang = await NewsMultilang.findById(newsMultilangId);
            newsMultilang = await newsMultilang.remove();
            res.json(newsMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    }
};