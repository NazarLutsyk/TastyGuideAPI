let Department = require(global.paths.MODELS + '/Department');
let Promo = require(global.paths.MODELS + '/Promo');
let Bonuse = require(global.paths.MODELS + '/Bonuse');
let News = require(global.paths.MODELS + '/News');
let Event = require(global.paths.MODELS + '/Event');
let BonuseMultilang = require(global.paths.MODELS + '/BonuseMultilang');
let NewsMultilang = require(global.paths.MODELS + '/NewsMultilang');
let EventMultilang = require(global.paths.MODELS + '/EventMultilang');
module.exports = {
    async updatePromoMultilang(req, res, next) {
        let user = req.user;
        let multilangId = req.params.id;
        if (user && user.departments && user.departments.length > 0) {
            let allowed = 0;
            if (req.originalUrl.indexOf('bonuses')) {
                let bonuseMultilang = await BonuseMultilang.findById(multilangId);
                let bonuse = await Promo.findById(bonuseMultilang.bonuse);
                let allowed = await Department.count({
                    place: bonuse.place,
                    client: user.departments
                });
            } else if (req.originalUrl.indexOf('events')) {
                let eventMultilang = await EventMultilang.findById(multilangId);
                let event = await Promo.findById(eventMultilang.event);
                let allowed = await Department.count({
                    place: event.place,
                    client: user.departments
                });
            } else if (req.originalUrl.indexOf('news')) {
                let newsMultilang = await NewsMultilang.findById(multilangId);
                let news = await Promo.findById(newsMultilang.news);
                let allowed = await Department.count({
                    place: news.place,
                    client: user.departments
                });
            }
            if (allowed > 0) {
                next();
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    }
};