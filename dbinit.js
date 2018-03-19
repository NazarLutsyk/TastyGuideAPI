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
Location = require('./models/Location');
TopPlace = require('./models/TopPlace');
HashTag = require('./models/HashTag');
Place = require('./models/Place');
Image = require('./models/Image');
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
    lang3 = await Lang.create({name: 'fr'});
    location1 = await Location.create({ltg: 50, lng: 45.5});
    location2 = await Location.create({ltg: 78, lng: 32});
    placeType1 = await PlaceType.create({});
    placeType2 = await PlaceType.create({});
    topPlace1 = await TopPlace.create({
        startDate: Date(),
        endDate: Date(),
        price: 10000,
        actual: true
    });
    topPlace2 = await TopPlace.create({
        startDate: Date(),
        endDate: Date(),
        price: 888,
        actual: true
    });
    topPlace3 = await TopPlace.create({
        startDate: Date(),
        endDate: Date(),
        price: 755,
        actual: true
    });
    topPlace4 = await TopPlace.create({
        startDate: Date(),
        endDate: Date(),
        price: 9999,
        actual: false
    });
    hashTag1 = await HashTag.create({value: '#hash'});
    hashTag2 = await HashTag.create({value: '#buhar'});
    hashTag3 = await HashTag.create({value: '#lalalala'});
    hashTag4 = await HashTag.create({value: '#qqqq'});
    day1 = await Day.create({
        startTime: Date(),
        endTime: Date()
    });
    day2 = await Day.create({
        startTime: Date(),
        endTime: Date()
    });
    day3 = await Day.create({
        startTime: Date(),
        endTime: Date()
    });
    day4 = await Day.create({
        startTime: Date(),
        endTime: Date()
    });
    day5 = await Day.create({
        startTime: Date(),
        endTime: Date()
    });
    news1 = await News.create({});
    news2 = await News.create({});
    bonuse1 = await Bonuse.create({
        startDate: Date(),
        endDate: Date()
    });
    bonuse2 = await Bonuse.create({
        startDate: Date(),
        endDate: Date()
    });
    event1 = await Event.create({});
    event2 = await Event.create({});
    eventM1 = await EventMultilang.create({
        header: 'header',
        description: 'descr'
    });
    eventM2 = await EventMultilang.create({
        header: 'header',
        description: 'descr'
    });
    eventM3 = await EventMultilang.create({
        header: 'header',
        description: 'descr'
    });
    eventM4 = await EventMultilang.create({
        header: 'header',
        description: 'descr'
    });
    bonuseM1 = await BonuseMultilang.create({
        header: 'header',
        description: 'descr',
        conditions: 'conditions'
    });
    bonuseM2 = await BonuseMultilang.create({
        header: 'header',
        description: 'descr',
        conditions: 'conditions'
    });
    bonuseM3 = await BonuseMultilang.create({
        header: 'header',
        description: 'descr',
        conditions: 'conditions'
    });
    bonuseM4 = await BonuseMultilang.create({
        header: 'header',
        description: 'descr',
        conditions: 'conditions'
    });
    newsM1 = await NewsMultilang.create({
        header: 'header',
        description: 'descr'
    });
    newsM2 = await NewsMultilang.create({
        header: 'header',
        description: 'descr'
    });
    newsM3 = await NewsMultilang.create({
        header: 'header',
        description: 'descr'
    });
    newsM4 = await NewsMultilang.create({
        header: 'header',
        description: 'descr'
    });
    placeTypeM1 = await PlaceTypeMultilang.create({
        name: 'placeType'
    });
    placeTypeM2 = await PlaceTypeMultilang.create({
        name: 'placeType'
    });
    placeTypeM3 = await PlaceTypeMultilang.create({
        name: 'placeType'
    });
    placeTypeM4 = await PlaceTypeMultilang.create({
        name: 'placeType'
    });
    placeM1 = await PlaceMultilang.create({
        name: 'place name',
        description: 'descr'
    });
    placeM2 = await PlaceMultilang.create({
        name: 'place name',
        description: 'descr'
    });
    placeM3 = await PlaceMultilang.create({
        name: 'place name',
        description: 'descr'
    });
    placeM4 = await PlaceMultilang.create({
        name: 'place name',
        description: 'descr'
    });
    place1 = await Place.create({
        phone: '355875545722',
        email: 'someemail@mail.com',
        averagePrice: 7000,
        reviews: 300,
        allowed: true
    });
    place2 = await Place.create({
        phone: '355875545722',
        email: 'someemail@mail.com',
        averagePrice: 7000,
        reviews: 300,
        allowed: true
    });
    image1 = await Image.create({
        name: 'xxx',
        extension: '.jpg',
        path: '/public/upload'
    });
    image2 = await Image.create({
        name: 'porn',
        extension: '.png',
        path: '/public/upload'
    });
    image3 = await Image.create({
        name: 'yaaah',
        extension: '.jpeg',
        path: '/public/upload'
    });
    complaint1 = await Complaint.create({
        value: 'So,so,so! huevo!'
    });
    complaint2 = await Complaint.create({
        value: 'So,so,so! huevo!'
    });
    complaint3 = await Complaint.create({
        value: 'So,so,so! huevo!'
    });
    complaint4 = await Complaint.create({
        value: 'So,so,so! huevo!'
    });
    app1 = await DrinkApplication.create({
        friends: 'I with my friends',
        goal: 'poebatsa',
        budged: 30,
        date: Date(),
    });
    app2 = await DrinkApplication.create({
        friends: 'I with my friends',
        goal: 'poebatsa',
        budged: 30,
        date: Date(),
    });
    app3 = await DrinkApplication.create({
        friends: 'I with my friends',
        goal: 'poebatsa',
        budged: 30,
        date: Date(),
    });
    app4 = await DrinkApplication.create({
        friends: 'I with my friends',
        goal: 'poebatsa',
        budged: 30,
        date: Date(),
    });
    rating1 = await Rating.create({
        value: 5,
        comment: 'Duze faino',
        price: 200,
    });
    rating2 = await Rating.create({
        value: 5,
        comment: 'Duze faino',
        price: 200,
    });
    rating3 = await Rating.create({
        value: 5,
        comment: 'Duze faino',
        price: 200,
    });
    rating4 = await Rating.create({
        value: 5,
        comment: 'Duze faino',
        price: 200,
    });
    department1 = await Department.create({
        roles: ['ADMIN_PLACE']
    });
    department2 = await Department.create({
        roles: ['ADMIN_PLACE']
    });
    department3 = await Department.create({
        roles: ['ADMIN_PLACE']
    });
    department4 = await Department.create({
        roles: ['ADMIN_PLACE']
    });
    client1 = await Client.create({
        name: 'Tasik',
        surname: 'Panasik',
        city: 'Jopsk',
        phone: '355875545722',
        email: 'someemail@mail.com',
        roles: ['USER'],
        avatar: '/public/upload/default.jpg'
    });
    client2 = await Client.create({
        name: 'Tasik',
        surname: 'Panasik',
        city: 'Jopsk',
        phone: '355875545722',
        email: 'someemail@mail.com',
        roles: ['USER'],
        avatar: '/public/upload/default.jpg'
    });
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
    return 'done';
}

async function addRelations() {
    await place1.superupdate(Place,{
        location : location1,
        images: [image1,image2],
        types : [placeType1],
        boss: client1,
        promos: [event1,bonuse1,news1],
        complaints:[complaint1,complaint2],
        drinkApplications:[app1,app2],
        ratings:[rating1,rating2],
        departments:[department1,department2],
        multilang:[placeM1,placeM2],
        days: [day1,day2,day3],
        hashTags: [hashTag1,hashTag2,hashTag3],
        tops:[topPlace1,topPlace2]
    });
    await place2.superupdate(Place,{
        location : location2,
        images: [image2,image3],
        types : [placeType2],
        boss: client2,
        promos: [event2,bonuse2,news2],
        complaints:[complaint4,complaint3],
        drinkApplications:[app4,app3],
        ratings:[rating4,rating3],
        departments:[department4,department3],
        multilang:[placeM3,placeM4],
        days: [day4],
        hashTags: [hashTag3,hashTag4],
        tops:[topPlace3,topPlace4]
    });
    await client1.superupdate(Client,{
        ownPlaces:[place1],
        drinkApplications:[app1,app2],
        complaints:[complaint1,complaint2],
        ratings:[rating1,rating2],
        departments:[department1,department2],
        favoritePlaces:[place1]
    });
    await client2.superupdate(Client,{
        ownPlaces:[place2],
        drinkApplications:[app3,app4],
        complaints:[complaint3,complaint4],
        ratings:[rating3,rating4],
        departments:[department3,department4],
        favoritePlaces:[place2]
    });
    await placeType1.superupdate(PlaceType,{
        multilang: [placeTypeM1,placeTypeM2]
    });
    await placeType2.superupdate(PlaceType,{
        multilang: [placeTypeM3,placeTypeM4]
    });
    await news1.superupdate(News,{
        multilang:[newsM1,newsM2],
        author:department1
    });
    await news2.superupdate(News,{
        multilang:[newsM3,newsM4],
        author:department2
    });
    await event1.superupdate(Event,{
        multilang:[eventM1,eventM2],
        author:department3
    });
    await event2.superupdate(Event,{
        multilang:[eventM3,eventM4],
        author:department4
    });
    await bonuse1.superupdate(Bonuse,{
        multilang:[bonuseM1,bonuseM2],
        author:department1
    });
    await bonuse2.superupdate(Bonuse,{
        multilang:[bonuseM3,bonuseM4],
        author:department4
    });
}

async function dbInit() {
    await createModels();
    await addRelations();
}

dbInit()
    .then(() => {
        console.log('done');
    })
    .catch((err) => {
        console.log(err);
    });