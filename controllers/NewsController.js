let News = require('../models/News');

module.exports = {
    async getNews(req, res) {
        try {
            let news = await News.find({});
            res.json(news);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getNewsById(req, res) {
        let newsId = req.params.id;
        try {
            let news = await News.findById(newsId);
            res.json(news);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createNews(req, res) {
        try {
            let news = await News.create(req.body);
            res.json(news);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateNews(req, res) {
        let newsId = req.params.id;
        try {
            let news = await News.findByIdAndUpdate(newsId, req.body,{new : true});
            res.json(news);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeNews(req, res) {
        let newsId = req.params.id;
        try {
            let news = await News.findById(newsId);
            news = await news.remove();
            res.json(news);
        } catch (e) {
            res.send(e.toString());
        }
    }
};