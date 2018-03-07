let News = require(global.paths.MODELS + '/News');
let relationHelper = require(global.paths.HELPERS + '/relationHelper');
let path = require('path');

module.exports = {
    async getNews(req, res) {
        try {
            let newsQuery = News
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    newsQuery.populate(populateField);
                }
            }
            let news = await newsQuery.exec();
            res.json(news);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getNewsById(req, res) {
        let newsId = req.params.id;
        try {
            let newsQuery = News.find({_id: newsId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    newsQuery.populate(populateField);
                }
            }
            let news = await newsQuery.exec();
            res.json(news);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createNews(req, res) {
        try {
            let news = await News.create(req.body);
            res.status(201).json(news);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateNews(req, res) {
        let newsId = req.params.id;
        try {
            let newsBonuse = await News.findByIdAndUpdate(newsId, req.body, {new: true});
            res.status(201).json(newsBonuse);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeNews(req, res) {
        let newsId = req.params.id;
        try {
            let news = await News.findById(newsId);
            news = await news.remove();
            res.status(204).json(news);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addMultilang(req, res) {
        let modelId = req.params.id;
        let multilangId = req.params.idMultilang;
        try {
            if (modelId && multilangId) {
                await relationHelper.addRelation
                ('News', 'NewsMultilang', modelId, multilangId, 'multilang', 'news');
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeMultilang(req, res) {
        let modelId = req.params.id;
        let multilangId = req.params.idMultilang;
        try {
            if (modelId && multilangId) {
                await relationHelper.removeRelation
                ('News', 'NewsMultilang', modelId, multilangId, 'multilang', 'news');
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};