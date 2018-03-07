let NewsMultilang = require(global.paths.MODELS + '/NewsMultilang');

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
            res.status(404).send(e.toString());
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
            res.status(404).send(e.toString());
        }
    },
    async createNewsMultilang(req, res) {
        try {
            let newsMultilang = await NewsMultilang.create(req.body);
            res.status(201).json(newsMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateNewsMultilang(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilang = await NewsMultilang.findByIdAndUpdate(newsMultilangId, req.body, {new: true});
            res.status(201).json(newsMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeNewsMultilang(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilang = await NewsMultilang.findById(newsMultilangId);
            newsMultilang = await newsMultilang.remove();
            res.status(204).json(newsMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};