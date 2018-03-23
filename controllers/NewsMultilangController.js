let NewsMultilang = require(global.paths.MODELS + '/NewsMultilang');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

module.exports = {
    async getNewsMultilangs(req, res) {
        try {
            let newsMultilangQuery = NewsMultilang
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields)
                .skip(req.query.skip)
                .limit(req.query.limit);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    newsMultilangQuery.populate(populateField);
                }
            }
            let newsMultilangs = await newsMultilangQuery.exec();
            res.json(newsMultilangs);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getNewsMultilangById(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilangQuery = NewsMultilang.findOne({_id: newsMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    newsMultilangQuery.populate(populateField);
                }
            }
            let newsMultilang = await newsMultilangQuery.exec();
            res.json(newsMultilang);
        }catch (e){
            res.status(400).send(e.toString());
        }
    },
    async createNewsMultilang(req, res) {
        try {
            let err = keysValidator.diff(NewsMultilang.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let newsMultilang = new NewsMultilang(req.body);
                newsMultilang = await newsMultilang.supersave();
                res.status(201).json(newsMultilang);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateNewsMultilang(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(NewsMultilang.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let newsMultilang = await NewsMultilang.findById(newsMultilangId);
                if (newsMultilang) {
                    let updated = await newsMultilang.superupdate(req.body);
                    res.status(201).json(updated);
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeNewsMultilang(req, res) {
        let newsMultilangId = req.params.id;
        try {
            let newsMultilang = await NewsMultilang.findById(newsMultilangId);
            if (newsMultilang) {
                newsMultilang = await newsMultilang.remove();
                res.status(204).json(newsMultilang);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};