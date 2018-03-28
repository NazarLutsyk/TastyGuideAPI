let News = require(global.paths.MODELS + '/News');
let path = require('path');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let upload = require(global.paths.MIDDLEWARE + '/multer')(path.join(global.paths.PUBLIC,'upload','promo'));
upload = upload.array('images');
module.exports = {
    async getNews(req, res) {
        try {
            let newsQuery;
            if (req.query.aggregate) {
                newsQuery = News.aggregate(req.query.aggregate);
            } else {
                newsQuery = News
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        newsQuery.populate(populateField);
                    }
                }
            }
            let news = await newsQuery.exec();
            res.json(news);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getNewsById(req, res) {
        let newsId = req.params.id;
        try {
            let newsQuery = News.findOne({_id: newsId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    newsQuery.populate(populateField);
                }
            }
            let news = await newsQuery.exec();
            res.json(news);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createNews(req, res) {
        try {
            let err = keysValidator.diff(News.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let news = new News(req.body);
                if (news) {
                    upload(req, res, async function (err) {
                        if (err) {
                            return res.status(400).send(err.toString());
                        } else {
                            if(!news.images)
                                news.images = [];
                            for (let file in req.files) {
                                let image = req.files[file].filename;
                                news.images.push(image);
                            }
                            try {
                                news.author = req.user._id;
                                news = await news.supersave();
                                res.status(201).json(news);
                            } catch (e) {
                                res.status(400).send(e.toString());
                            }
                        }
                    });
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateNews(req, res) {
        let newsId = req.params.id;
        try {
            let err = keysValidator.diff(News.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let news = await News.findById(newsId);
                if (news) {
                    upload(req, res, async function (err) {
                        if (err) {
                            return res.status(400).send(err.toString());
                        } else {
                            if(!req.body.images)
                                req.body.images = [];
                            for (let file in req.files) {
                                let image = req.files[file].filename;
                                req.body.images.push(image);
                            }
                            try {
                                let updated = await news.superupdate(req.body);
                                res.status(201).json(updated);
                            } catch (e) {
                                res.status(400).send(e.toString());
                            }
                        }
                    });
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeNews(req, res) {
        let newsId = req.params.id;
        try {
            let news = await News.findById(newsId);
            if (news) {
                news = await news.remove();
                res.status(204).json(news);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
};