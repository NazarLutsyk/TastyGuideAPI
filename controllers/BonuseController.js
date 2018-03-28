let Bonuse = require(global.paths.MODELS + '/Bonuse');
let path = require('path');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let upload = require(global.paths.MIDDLEWARE + '/multer')(path.join(global.paths.PUBLIC,'upload','promo'));
upload = upload.array('images');
module.exports = {
    async getBonuses(req, res) {
        try {
            let bonuseQuery;
            if (req.query.aggregate) {
                bonuseQuery = Bonuse.aggregate(req.query.aggregate);
            } else {
                bonuseQuery = Bonuse
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        bonuseQuery.populate(populateField);
                    }
                }
            }
            let bonuses = await bonuseQuery.exec();
            res.json(bonuses);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getBonuseById(req, res) {
        let bonuseId = req.params.id;
        try {
            let bonuseQuery = Bonuse.findOne({_id: bonuseId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    bonuseQuery.populate(populateField);
                }
            }
            let bonuse = await bonuseQuery.exec();
            res.json(bonuse);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createBonuse(req, res) {
        try {
            let err = keysValidator.diff(Bonuse.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let bonuse = new Bonuse(req.body);
                if (bonuse) {
                    upload(req, res, async function (err) {
                        if (err) {
                            return res.status(400).send(err.toString());
                        } else {
                            if(!bonuse.images)
                                bonuse.images = [];
                            for (let file in req.files) {
                                let image = req.files[file].filename;
                                bonuse.images.push(image);
                            }
                            try {
                                bonuse.author = req.user._id;
                                bonuse = await bonuse.supersave();
                                res.status(201).json(bonuse);
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
    async updateBonuse(req, res) {
        let bonuseId = req.params.id;
        try {
            let err = keysValidator.diff(Bonuse.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let bonuse = await Bonuse.findById(bonuseId);
                if (bonuse) {
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
                } else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeBonuse(req, res) {
        let bonuseId = req.params.id;
        try {
            let bonuse = await Event.findById(bonuseId);
            if (bonuse) {
                bonuse = await bonuse.remove();
                res.status(204).json(bonuse);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
};