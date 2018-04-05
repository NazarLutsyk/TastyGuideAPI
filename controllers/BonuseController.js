let Bonuse = require('../models/Bonuse');
let path = require('path');
let keysValidator = require('../validators/keysValidator');
let upload = require('../middleware/multer')(path.join(__dirname,'../public','upload', 'promo'));
upload = upload.array('images');
module.exports = {
    async getBonuses(req, res,next) {
        try {
            res.json(await Bonuse.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getBonuseById(req, res,next) {
        let bonuseId = req.params.id;
        try {
            req.query.target.query._id = bonuseId;
            res.json(await Bonuse.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createBonuse(req, res,next) {
        try {
            let err = keysValidator.diff(Bonuse.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let bonuse = new Bonuse(req.body);
                if (bonuse) {
                    upload(req, res, async function (err) {
                        if (err) {
                            err.status = 400;
                            return next(err);
                        } else {
                            if (!bonuse.images)
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
                                e.status = 400;
                                return next(e);
                            }
                        }
                    });
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateBonuse(req, res,next) {
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
                            err.status = 400;
                            return next(err);
                        } else {
                            if (!req.body.images)
                                req.body.images = [];
                            for (let file in req.files) {
                                let image = req.files[file].filename;
                                req.body.images.push(image);
                            }
                            try {
                                let updated = await news.superupdate(req.body);
                                res.status(201).json(updated);
                            } catch (e) {
                                e.status = 400;
                                return next(e);
                            }
                        }
                    });
                } else {
                    let e = new Error();
                    e.message = 'Not found';
                    e.status = 404;
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeBonuse(req, res,next) {
        let bonuseId = req.params.id;
        try {
            let bonuse = await Event.findById(bonuseId);
            if (bonuse) {
                bonuse = await bonuse.remove();
                res.status(204).json(bonuse);
            } else {
                let e = new Error();
                e.status = 404;
                e.message = 'Not found';
                return next(e);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
};