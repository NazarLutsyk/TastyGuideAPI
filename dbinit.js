mongoose = require('mongoose');
require('./config/path');
EventMultilang = require('./models/EventMultilang');
BonuseMultilang = require('./models/BonuseMultilang');
NewsMultilang = require('./models/NewsMultilang');
PlaceTypeMultilang = require('./models/PlaceTypeMultilang');
PlaceMultilang = require('./models/PlaceMultilang');
Multilang = require('./models/Multilang');
News = require('./models/News');
Bonuse = require('./models/Bonuse');
Event = require('./models/Event');
Promo = require('./models/Promo');
PlaceType = require('./models/PlaceType');
Lang = require('./models/Lang');
Day = require('./models/Day');
TopPlace = require('./models/TopPlace');
HashTag = require('./models/HashTag');
Place = require('./models/Place');
Complaint = require('./models/Complaint');
DrinkApplication = require('./models/DrinkApplication');
Rating = require('./models/Rating');
Department = require('./models/Department');
Currency = require('./models/Currency');
Client = require('./models/Client');
Message = require('./models/Message');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/drinker');

let lang1;
let lang2;
let lang3;
let location1;
let location2;
let placeType1;
let placeType2;
let topPlace1;
let topPlace2;
let topPlace3;
let topPlace4;
let hashTag1;
let hashTag2;
let hashTag3;
let hashTag4;
let day1;
let day2;
let day3;
let day4;
let day5;
let news1;
let news2;
let bonuse1;
let bonuse2;
let event1;
let event2;
let eventM1;
let eventM2;
let eventM3;
let eventM4;
let bonuseM1;
let bonuseM2;
let bonuseM3;
let bonuseM4;
let newsM1;
let newsM2;
let newsM3;
let newsM4;
let placeTypeM1;
let placeTypeM2;
let placeTypeM3;
let placeTypeM4;
let placeM1;
let placeM2;
let placeM3;
let placeM4;
let place1;
let place2;
let image1;
let image2;
let image3;
let complaint1;
let complaint2;
let complaint3;
let complaint4;
let rating1;
let rating2;
let rating3;
let rating4;
let app1;
let app2;
let app3;
let app4;
let department1;
let department2;
let department3;
let department4;
let client1;
let client2;
let message1;
let message2;


async function createModels() {
    lang1 = await Lang.create({name: 'eng'});
    lang2 = await Lang.create({name: 'ukr'});
    placeType1 = await PlaceType.create({});
    placeType2 = await PlaceType.create({});
    placeTypeM1 = await PlaceTypeMultilang.create({
        name: 'placeType',
        placeType: placeType1,
        lang: lang1
    });
    placeTypeM2 = await PlaceTypeMultilang.create({
        name: 'placeType',
        placeType: placeType1,
        lang: lang2
    });
    placeTypeM3 = await PlaceTypeMultilang.create({
        name: 'placeType',
        placeType: placeType2,
        lang: lang1
    });
    placeTypeM4 = await PlaceTypeMultilang.create({
        name: 'placeType',
        placeType: placeType2,
        lang: lang2
    });
    hashTag1 = await HashTag.create({value: '#hash'});
    hashTag2 = await HashTag.create({value: '#buhar'});
    hashTag3 = await HashTag.create({value: '#lalalala'});
    hashTag4 = await HashTag.create({value: '#qqqq'});
    client1 = await Client.create({
        name: 'Tasik',
        surname: 'Panasik',
        city: 'Jopsk',
        phone: '355875545722',
        email: 'someemail@mail.com',
        avatar: '/public/upload/default.jpg'
    });
    client2 = await Client.create({
        name: 'Tasik',
        surname: 'Panasik',
        city: 'Jopsk',
        phone: '355875545722',
        email: 'someemail@mail.com',
        avatar: '/public/upload/default.jpg'
    });
    //todo favorite place
    message1 = await Message.create({
        value: 'Idi suka nahui!',
        sender: client2,
        receiver: client1,
    });
    message2 = await Message.create({
        value: 'Sam idi!',
        sender: client1,
        receiver: client2,
    });
    place1 = await Place.create({
        phone: '355875545722',
        email: 'someemail@mail.com',
        averagePrice: 7000,
        reviews: 300,
        allowed: true,
        location:{
            ltg : 442,
            lng: 774
        },
        images : ['/public/upload/default.jpg'],
        types: [placeType1],
        hashTags: [hashTag1,hashTag2]
    });
    place2 = await Place.create({
        phone: '355875545722',
        email: 'someemail@mail.com',
        averagePrice: 7000,
        reviews: 300,
        allowed: true,
        location:{
            ltg : 442,
            lng: 774
        },
        images : ['/public/upload/default.jpg'],
        types: [placeType2],
        hashTags: [hashTag3,hashTag4]
    });
    topPlace1 = await TopPlace.create({
        startDate: Date(),
        endDate: Date(),
        price: 10000,
        actual: true,
        place:place1
    });
    topPlace2 = await TopPlace.create({
        startDate: Date(),
        endDate: Date(),
        price: 888,
        actual: true,
        place:place1
    });
    topPlace3 = await TopPlace.create({
        startDate: Date(),
        endDate: Date(),
        price: 755,
        actual: true,
        place:place2
    });
    topPlace4 = await TopPlace.create({
        startDate: Date(),
        endDate: Date(),
        price: 9999,
        actual: false,
        place:place2
    });
    day1 = await Day.create({
        startTime: Date(),
        endTime: Date(),
        place:place1
    });
    day2 = await Day.create({
        startTime: Date(),
        endTime: Date(),
        place:place1
    });
    day4 = await Day.create({
        startTime: Date(),
        endTime: Date(),
        place:place2
    });
    day5 = await Day.create({
        startTime: Date(),
        endTime: Date(),
        place:place2
    });
    placeM1 = await PlaceMultilang.create({
        name: 'place name',
        description: 'descr',
        place:place1,
        lang: lang1
    });
    placeM2 = await PlaceMultilang.create({
        name: 'place name',
        description: 'descr',
        place:place1,
        lang: lang2
    });
    placeM3 = await PlaceMultilang.create({
        name: 'place name',
        description: 'descr',
        place:place2,
        lang: lang1
    });
    placeM4 = await PlaceMultilang.create({
        name: 'place name',
        description: 'descr',
        place:place2,
        lang: lang2
    });
    department1 = await Department.create({
        roles: ['BOSS_PLACE'],
        client:client1,
        place:place1
    });
    department2 = await Department.create({
        roles: ['ADMIN_PLACE'],
        client:client1,
        place:place1
    });
    department3 = await Department.create({
        roles: ['BOSS_PLACE'],
        client:client2,
        place:place2
    });
    department4 = await Department.create({
        roles: ['ADMIN_PLACE'],
        client:client2,
        place:place2
    });
    complaint1 = await Complaint.create({
        value: 'So,so,so! huevo!',
        client:client1,
        place:place1
    });
    complaint2 = await Complaint.create({
        value: 'So,so,so! huevo!',
        client:client1,
        place:place1
    });
    complaint3 = await Complaint.create({
        value: 'So,so,so! huevo!',
        client:client2,
        place:place2
    });
    complaint4 = await Complaint.create({
        value: 'So,so,so! huevo!',
        client:client2,
        place:place2
    });
    app1 = await DrinkApplication.create({
        friends: 'I with my friends',
        goal: 'poebatsa',
        budged: 30,
        date: Date(),
        organizer:client1,
        place:place1
    });
    app2 = await DrinkApplication.create({
        friends: 'I with my friends',
        goal: 'poebatsa',
        budged: 30,
        date: Date(),
        organizer:client1,
        place:place1
    });
    app3 = await DrinkApplication.create({
        friends: 'I with my friends',
        goal: 'poebatsa',
        budged: 30,
        date: Date(),
        organizer:client2,
        place:place2
    });
    app4 = await DrinkApplication.create({
        friends: 'I with my friends',
        goal: 'poebatsa',
        budged: 30,
        date: Date(),
        organizer:client2,
        place:place2
    });
    rating1 = await Rating.create({
        value: 5,
        comment: 'Duze faino',
        price: 200,
        client:client1,
        place:place1
    });
    rating2 = await Rating.create({
        value: 5,
        comment: 'Duze faino',
        price: 200,
        client:client1,
        place:place1
    });
    rating3 = await Rating.create({
        value: 5,
        comment: 'Duze faino',
        price: 200,
        client:client2,
        place:place2
    });
    rating4 = await Rating.create({
        value: 5,
        comment: 'Duze faino',
        price: 200,
        client:client2,
        place:place2
    });
    news1 = await News.create({
        author:department1,
        place:place1,
        images:['/public/upload/default.jpg']
    });
    news2 = await News.create({
        author:department2,
        place:place2,
        images:['/public/upload/default.jpg']
    });
    bonuse1 = await Bonuse.create({
        startDate: Date(),
        endDate: Date(),
        author:department1,
        place:place1,
        images:['/public/upload/default.jpg']
    });
    bonuse2 = await Bonuse.create({
        startDate: Date(),
        endDate: Date(),
        author:department2,
        place:place2,
        images:['/public/upload/default.jpg']
    });
    event1 = await Event.create({
        author:department1,
        place:place1,
        images:['/public/upload/default.jpg']
    });
    event2 = await Event.create({
        author:department2,
        place:place2,
        images:['/public/upload/default.jpg']
    });
    eventM1 = await EventMultilang.create({
        header: 'header',
        description: 'descr',
        promo: event1,
        lang:lang1,
    });
    eventM2 = await EventMultilang.create({
        header: 'header',
        description: 'descr',
        promo: event1,
        lang:lang2
    });
    eventM3 = await EventMultilang.create({
        header: 'header',
        description: 'descr',
        promo: event2,
        lang:lang1
    });
    eventM4 = await EventMultilang.create({
        header: 'header',
        description: 'descr',
        promo: event2,
        lang:lang2
    });
    bonuseM1 = await BonuseMultilang.create({
        header: 'header',
        description: 'descr',
        conditions: 'conditions',
        promo: bonuse1,
        lang: lang1
    });
    bonuseM2 = await BonuseMultilang.create({
        header: 'header',
        description: 'descr',
        conditions: 'conditions',
        promo: bonuse1,
        lang: lang2
    });
    bonuseM3 = await BonuseMultilang.create({
        header: 'header',
        description: 'descr',
        conditions: 'conditions',
        promo: bonuse2,
        lang: lang1
    });
    bonuseM4 = await BonuseMultilang.create({
        header: 'header',
        description: 'descr',
        conditions: 'conditions',
        promo: bonuse2,
        lang: lang2
    });
    newsM1 = await NewsMultilang.create({
        header: 'header',
        description: 'descr',
        promo: news1,
        lang: lang1
    });
    newsM2 = await NewsMultilang.create({
        header: 'header',
        description: 'descr',
        promo: news1,
        lang: lang2
    });
    newsM3 = await NewsMultilang.create({
        header: 'header',
        description: 'descr',
        promo: news2,
        lang: lang1
    });
    newsM4 = await NewsMultilang.create({
        header: 'header',
        description: 'descr',
        promo: news2,
        lang: lang2
    });
    await Client.update({_id:client1},{$push:{favoritePlaces:place1}});
    await Client.update({_id:client2},{$push:{favoritePlaces:place2}});
    return 'done';
}

async function dbInit() {
    await createModels();
}

dbInit()
    .then(() => {
        console.log('done');
    })
    .catch((err) => {
        console.log(err);
    });