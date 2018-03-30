let TopPlace = require('../models/TopPlace');
let Place = require('../models/Place');

//deletes places in query that are older than 3 days
setInterval(async function () {
    try {
        let now = new Date();
        let notAllowedPlaces = await Place.find({
            allowed: false
        });
        for (let place of notAllowedPlaces) {
            if (now.getDate() - place.createdAt.getDate() >= 3) {
                await place.remove();
                log(`remove place`);
            }
        }
    }
    catch (e) {
        log(e);
    }
}, 1000*60*60*12);

//stops action of top places that termin are expired
setInterval(async function () {
    try {
        let now = new Date();
        let topPlaces = await TopPlace.find({
            actual: true
        });
        for (let topPlace of topPlaces) {
            if (now >= topPlace.endDate) {
                await TopPlace.findByIdAndUpdate(topPlace._id, {actual: false});
                log(`update TopPlace`);
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}, 1000*60*60*12);


