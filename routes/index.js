var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/test', async function (req, res) {
    let PlaceType = require('../models/PlaceType');
    let Lang = require('../models/Lang');
    let Place = require('../models/Place');
    let News = require('../models/News');
    let Bonus = require('../models/Bonuse');
    let Event = require('../models/Event');
    let Client = require('../models/Client');
    let Department = require('../models/Department');
    let Complaint = require('../models/Complaint');
    let Rating = require('../models/Rating');
    let Currency = require('../models/Currency');
    let DrinkApplication = require('../models/DrinkApplication');
    let TopPlace = require('../models/TopPlace');
    let PlaceMultilang = require('../models/PlaceMultilang');
    let Day = require('../models/Day');
    let BonuseMultilang = require('../models/BonuseMultilang');
    let EventMultilang = require('../models/EventMultilang');
    let NewsMultilang = require('../models/NewsMultilang');
    let PlaceTypeMultilang = require('../models/PlaceTypeMultilang');
    let HashTag = require('../models/HashTag');

    try {
        let lang = await Lang.create({
            name: 'ua'
        });
        let client = await Client.create({
            name: 'Nazik',
            surname: 'Tazik',
            login: 'login',
            password: 'super secret password',
            city: 'Lviv',
            email: 'nlutsik1@gmail.com',
            roles: ['Super bliaha admin']
        });
        let news = await News.create({
            header: 'Header News',
            description: 'Description news',
            author: client
        });
        let newsMultilang = await NewsMultilang.create({
            header: 'Бонус',
            description: 'Супер бонус',
            news: news,
            lang : lang
        });
        let bonuse = await Bonus.create({
            startDate: Date.now(),
            endDate: Date.now(),
            author: client
        });
        let bonuseMultilang = await BonuseMultilang.create({
            header: 'Бонус',
            description: 'Супер бонус',
            conditions: 'умови',
            bonuse: bonuse,
            lang : lang
        });
        let event = await Event.create({
            header: 'Header Event',
            description: 'Description Event',
            author: client
        });
        let eventMultilang = await EventMultilang.create({
            header: 'Бонус',
            description: 'Супер бонус',
            event: event,
            lang : lang
        });
        let complaint = await Complaint.create({
            value: 'Complaint',
            client: client
        });
        let rating = await Rating.create({
            value: 5,
            comment: 'super',
            client: client
        });
        let department = await Department.create({
            roles: ['super admin'],
            client: client,
            promos: [news, bonuse, event]
        });
        let currency = await Currency.create({
            value: 'grn'
        });
        let drinkApplication = await DrinkApplication.create({
            friends: 'none',
            goal: 'sex',
            budged: 100,
            data: Date.now(),
            organizer: client,
            currency: currency
        });
        let placeType = await PlaceType.create({
        });
        let placeTypeMultilang = await PlaceTypeMultilang.create({
            name : 'Університет',
            lang : lang,
            placeType:placeType
        });
        let date = new Date();
        let place = await Place.create({
            posRating: 100,
            negRating: 0,
            phone: '380686252887',
            location: {
                ltg: 10,
                lng: 20
            },
            image: 'image',
            averagePrice: 5000,
            reviews: 100000,
            types: [
                placeType
            ],
        });
        let topPlace = await TopPlace.create({
            startDate: Date.now(),
            endDate: Date.now(),
            price: 10000,
            place: place,
        });
        let placeMultilang = await PlaceMultilang.create({
            name: 'ОктенВеб',
            description: 'Краща айті компанія',
            place: place,
            lang: lang
        });
        let day1 = await Day.create({
            date : Date.now(),
            startTime : Date.now(),
            endTime : Date.now(),
            holiday: false,
            place : place
        });
        let day2 = await Day.create({
            date : Date.now(),
            holiday: true,
            place : place
        });
        let hashTag = await HashTag.create({
            value : '#JAVASCRIPT',
            places: [place]
        });

        client.favoritePlaces = [place];
        client.applications = [drinkApplication];
        client.ratings = [rating];
        client.complaints = [complaint];
        client.departments = [department];
        client = await client.save();

        drinkApplication.place = place;
        drinkApplication = await drinkApplication.save();

        complaint.place = place;
        complaint = await complaint.save();

        rating.place = place;
        rating = await rating.save();

        department.place = place;
        department.promos = [news,bonuse,event];
        department = await department.save();

        news.author = department;
        news.multilang = newsMultilang;
        news = await news.save();

        bonuse.author = department;
        bonuse.multilang = bonuseMultilang;
        bonuse = await bonuse.save();

        event.author = department;
        event.multilang = eventMultilang;
        event = await event.save();

        placeType.multilang = placeTypeMultilang;
        placeType = await placeType.save();

        place.promos = [event,news,bonuse];
        place.complaints = [complaint];
        place.drinkApplications = [drinkApplication];
        place.ratings = [rating];
        place.departments = [department];
        place.multilang = placeMultilang;
        place.days = [day1,day2];
        place.hashTags = [hashTag];

        place = await place.save();

        console.log('PLACE');
        console.log(place);
        console.log('=====================================================');
        console.log('PLACE MULTILANG');
        console.log(placeMultilang);
        console.log('=====================================================');
        console.log('LANG');
        console.log(lang);
        console.log('=====================================================');
        console.log('TOP PLACE');
        console.log(topPlace);
        console.log('=====================================================');
        console.log('PLACE TYPE');
        console.log(placeType);
        console.log('=====================================================');
        console.log('PLACE TYPE MULTILANG');
        console.log(placeTypeMultilang);
        console.log('=====================================================');
        console.log('NEWS');
        console.log(news);
        console.log('=====================================================');
        console.log('NEWS MULTILANG');
        console.log(newsMultilang);
        console.log('=====================================================');
        console.log('EVENT');
        console.log(event);
        console.log('=====================================================');
        console.log('EVENT MULTILANG');
        console.log(eventMultilang);
        console.log('=====================================================');
        console.log('BONUSE');
        console.log(bonuse);
        console.log('=====================================================');
        console.log('BONUSE MULTILANG');
        console.log(bonuseMultilang);
        console.log('=====================================================');
        console.log('COMPLAINT');
        console.log(complaint);
        console.log('=====================================================');
        console.log('CURRENCY');
        console.log(currency);
        console.log('=====================================================');
        console.log('DRINK APPLICATION');
        console.log(drinkApplication);
        console.log('=====================================================');
        console.log('RATING');
        console.log(rating);
        console.log('=====================================================');
        console.log('DEPARTMENT');
        console.log(department);
        console.log('=====================================================');
        console.log('CLIENT');
        console.log(client);
        console.log('=====================================================');
        console.log('DAYS');
        console.log(day1 + '\n' + day2);
        console.log('=====================================================');
        console.log('HASH TAGS');
        console.log(hashTag);
        console.log('=====================================================');
    }catch (e){
        console.log(e);
    }

    res.redirect('/');
});

module.exports = router;
