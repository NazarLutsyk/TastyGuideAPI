let TopPlace = require("../models/TopPlace");
let Place = require("../models/Place");
let DrinkApplication = require("../models/DrinkApplication");

//deletes places in query that are older than 3 days
setInterval(async function () {
    try {
        let now = new Date();
        let notAllowedPlaces = await Place.find({
            allowed: false
        });
        let toDelete = [];
        for (let place of notAllowedPlaces) {
            if (now.getDate() - place.createdAt.getDate() >= 3) {
                toDelete.push(place._id);
            }
        }
        if (toDelete.length > 0) {
            await Place.remove({_id: toDelete});
            log(`remove places`);
        }
    }
    catch (e) {
        log(e);
    }
}, 1000 * 60 * 60 * 12);

//stops action of top places that termin are expired
setInterval(async function () {
    try {
        let now = new Date();
        let topPlaces = await TopPlace.find({
            actual: true
        });
        let toUpdate = [];
        for (let topPlace of topPlaces) {
            if (now >= topPlace.endDate) {
                toUpdate.push(topPlace._id);
            }
        }
        if (toUpdate.length > 0) {
            await TopPlace.update({_id: toUpdate}, {actual: false});
            log(`update TopPlaces`);
        }
    }
    catch (e) {
        console.log(e);
    }
}, 1000 * 60 * 60 * 12);

//delete old drink applications
setInterval(async function () {
    try {
        let now = new Date();
        let drinkApps = await DrinkApplication.find({
            createdAt: {$lte: now}
        });
        let toDelete = [];
        for (let drinkApp of drinkApps) {
            if (now.getDate() - drinkApp.date.getDate() >= 1) {
                toDelete.push(drinkApp._id);
            }
        }
        if (toDelete.length > 0) {
            await DrinkApplication.remove({_id: toDelete});
            log(`update DrinkApps`);
        }
    }
    catch (e) {
        console.log(e);
    }
}, 1000 * 60 * 60 * 12);



