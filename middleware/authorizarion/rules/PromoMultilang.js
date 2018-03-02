let Department = require('../../../models/Department');
let Promo = require('../../../models/Promo');
let Bonuse = require('../../../models/Bonuse');
let News = require('../../../models/News');
let Event = require('../../../models/Event');
let BonuseMultilang = require('../../../models/BonuseMultilang');
let NewsMultilang = require('../../../models/NewsMultilang');
let EventMultilang = require('../../../models/EventMultilang');
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