let TopPlace = require("../models/TopPlace");
let Place = require("../models/Place");
let Promo = require("../models/Promo");
let DrinkApplication = require("../models/DrinkApplication");

//todo ???
//deletes places in query that are older than 3 days
// setInterval(async function () {
//     try {
//         let now = new Date();
//         let notAllowedPlaces = await Place.find({
//             allowed: false
//         });
//         let toDelete = [];
//         for (let place of notAllowedPlaces) {
//             if (now.getDate() - place.createdAt.getDate() >= 3) {
//                 toDelete.push(place.remove());
//             }
//         }
//         if (toDelete.length > 0) {
//             await Promise.all(toDelete);
//         }
//     }
//     catch (e) {
//         log(e);
//     }
// }, 5000);

//stops action of top places that termin are expired
setInterval(async function () {
    try {
        let now = new Date();
        await TopPlace.update(
            {
                endDate: {$lt: now},
                actual: true
            },
            {actual: false},
            {multi: true}
        );
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
            date: {$lt: now}
        });
        if (drinkApps.length > 0) {
            let queries = [];
            for (const drinkApp of drinkApps) {
                queries.push(drinkApp.remove());
            }
            await Promise.all(queries);
        }
    }
    catch (e) {
        console.log(e);
    }
}, 1000 * 60 * 60 * 12);

// delete old promos
setInterval(async function () {
    try {
        let now = new Date();
        let promosToDelete = await Promo.find({
            endDate: {$lt: now}
        });
        if (promosToDelete.length > 0) {
            let queries = [];
            for (const promo of promosToDelete) {
                queries.push(promo.remove());
            }
            await Promise.all(queries);
        }
    }
    catch (e) {
        console.log(e);
    }
}, 1000 * 60 * 60 * 12);
