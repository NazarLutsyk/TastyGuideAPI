require('../../config/path');
let Client = require('../../models/Client');
let Location = require('../../models/Location');
let Image = require('../../models/Image');
let PlaceType = require('../../models/PlaceType');
let Promo = require('../../models/News');
let Multilang = require('../../models/PlaceMultilang');
let Day = require('../../models/Day');
let HashTag = require('../../models/HashTag');
let TopPlace = require('../../models/TopPlace');
let Complaint = require('../../models/Complaint');
let DrinkApplication = require('../../models/DrinkApplication');
let Rating = require('../../models/Rating');
let Department = require('../../models/Department');
let Place = require('../../models/Place');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('place relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idLocation = new mongoose.Types.ObjectId;
            let idImage = new mongoose.Types.ObjectId;
            let idBoss = new mongoose.Types.ObjectId;
            let idType = new mongoose.Types.ObjectId;
            let idPromo = new mongoose.Types.ObjectId;
            let idComplaint = new mongoose.Types.ObjectId;
            let idDrinkApp = new mongoose.Types.ObjectId;
            let idRating = new mongoose.Types.ObjectId;
            let idDepartment = new mongoose.Types.ObjectId;
            let idMultilang = new mongoose.Types.ObjectId;
            let idDay = new mongoose.Types.ObjectId;
            let idHashTag = new mongoose.Types.ObjectId;
            let idTop = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;
            beforeEach(async function () {
                await Location.create({
                    _id: idLocation,
                    ltg: 45,
                    lng: 74
                });
                await Image.create({
                    _id: idImage
                });
                await Client.create({
                    _id: idBoss,
                    name: 'asdas',
                    surname: 'asds'
                });
                await PlaceType.create({
                    _id: idType,
                });
                await Promo.create({
                    _id: idPromo,
                });
                await Complaint.create({
                    _id: idComplaint,
                    value: 'asds'
                });
                await DrinkApplication.create({
                    _id: idDrinkApp,
                    date: new Date()
                });
                await Rating.create({
                    _id: idRating
                });
                await Department.create({
                    _id: idDepartment
                });
                await Multilang.create({
                    _id: idMultilang,
                    name: 'sd',
                    description: 'asd'
                });
                await Day.create({
                    _id: idDay,
                    startTime: new Date(),
                    endTime: new Date()
                });
                await HashTag.create({
                    _id: idHashTag,
                    value: 'sd'
                });
                await TopPlace.create({
                    _id: idTop,
                    startDate: new Date(),
                    endDate: new Date(),
                    price: 454
                });
                await Place.create({
                    _id: idPlace,
                    email: 'aasdass@sds.sds',
                    phone: '23234423342',
                });
            });
            afterEach(async function () {
                await Location.remove();
                await Image.remove();
                await PlaceType.remove();
                await Promo.remove();
                await Complaint.remove();
                await Rating.remove();
                await DrinkApplication.remove();
                await Department.remove();
                await Place.remove();
                await Client.remove();
                await Multilang.remove();
                await Day.remove();
                await HashTag.remove();
                await TopPlace.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/places/')
                    .send({
                        email: 'asdasd@sad.sds',
                        phone: '232342342323',
                        location: idLocation,
                        images: [idImage],
                        types: [idType],
                        promos: [idPromo],
                        complaints: [idComplaint],
                        ratings: [idRating],
                        drinkApplications: [idDrinkApp],
                        departments: [idDepartment],
                        multilang: [idMultilang],
                        days: [idDay],
                        hashTags: [idHashTag],
                        tops: [idTop],
                        boss: idBoss
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.location.toString().should.equal(idLocation.toString());
                res.body.images.should.lengthOf(1);
                res.body.boss.toString().should.equal(idBoss.toString());
                res.body.types.should.lengthOf(1);
                res.body.promos.should.lengthOf(1);
                res.body.complaints.should.lengthOf(1);
                res.body.ratings.should.lengthOf(1);
                res.body.drinkApplications.should.lengthOf(1);
                res.body.departments.should.lengthOf(1);
                res.body.multilang.should.lengthOf(1);
                res.body.days.should.lengthOf(1);
                res.body.hashTags.should.lengthOf(1);
                res.body.tops.should.lengthOf(1);

                let location = await Location.findById(idLocation);
                let boss = await Client.findById(idBoss);
                let promo = await Promo.findById(idPromo);
                let complaint = await Complaint.findById(idComplaint);
                let rating = await Rating.findById(idRating);
                let drinkApp = await DrinkApplication.findById(idDrinkApp);
                let department = await Department.findById(idDepartment);
                let multillang = await Multilang.findById(idMultilang);
                let day = await Day.findById(idDay);
                let hashTag = await HashTag.findById(idHashTag);
                let top = await TopPlace.findById(idTop);

                location.place.toString().should.equal(res.body._id.toString());
                boss.ownPlaces.should.lengthOf(1);
                promo.place.toString().should.equal(res.body._id.toString());
                complaint.place.toString().should.equal(res.body._id.toString());
                rating.place.toString().should.equal(res.body._id.toString());
                drinkApp.place.toString().should.equal(res.body._id.toString());
                department.place.toString().should.equal(res.body._id.toString());
                multillang.place.toString().should.equal(res.body._id.toString());
                day.place.toString().should.equal(res.body._id.toString());
                hashTag.places.should.lengthOf(1);
                top.place.toString().should.equal(res.body._id.toString());
            });
        });
        describe('update', function () {
            let idLocation = new mongoose.Types.ObjectId;
            let idImage = new mongoose.Types.ObjectId;
            let idBoss = new mongoose.Types.ObjectId;
            let idType = new mongoose.Types.ObjectId;
            let idPromo = new mongoose.Types.ObjectId;
            let idComplaint = new mongoose.Types.ObjectId;
            let idDrinkApp = new mongoose.Types.ObjectId;
            let idRating = new mongoose.Types.ObjectId;
            let idDepartment = new mongoose.Types.ObjectId;
            let idMultilang = new mongoose.Types.ObjectId;
            let idDay = new mongoose.Types.ObjectId;
            let idHashTag = new mongoose.Types.ObjectId;
            let idTop = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;
            beforeEach(async function () {
                await Location.create({
                    _id: idLocation,
                    ltg: 45,
                    lng: 74
                });
                await Image.create({
                    _id: idImage
                });
                await Client.create({
                    _id: idBoss,
                    name: 'asdas',
                    surname: 'asds'
                });
                await PlaceType.create({
                    _id: idType,
                });
                await Promo.create({
                    _id: idPromo,
                });
                await Complaint.create({
                    _id: idComplaint,
                    value: 'asds'
                });
                await DrinkApplication.create({
                    _id: idDrinkApp,
                    date: new Date()
                });
                await Rating.create({
                    _id: idRating
                });
                await Department.create({
                    _id: idDepartment
                });
                await Multilang.create({
                    _id: idMultilang,
                    name: 'sd',
                    description: 'asd'
                });
                await Day.create({
                    _id: idDay,
                    startTime: new Date(),
                    endTime: new Date()
                });
                await HashTag.create({
                    _id: idHashTag,
                    value: 'sd'
                });
                await TopPlace.create({
                    _id: idTop,
                    startDate: new Date(),
                    endDate: new Date(),
                    price: 454
                });
                await Place.create({
                    _id: idPlace,
                    email: 'aasdass@sds.sds',
                    phone: '23234423342',
                });
            });
            afterEach(async function () {
                await Location.remove();
                await Image.remove();
                await PlaceType.remove();
                await Promo.remove();
                await Complaint.remove();
                await Rating.remove();
                await DrinkApplication.remove();
                await Department.remove();
                await Place.remove();
                await Client.remove();
                await Multilang.remove();
                await Day.remove();
                await HashTag.remove();
                await TopPlace.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/places/' + idPlace)
                    .send({
                        location: idLocation,
                        images: [idImage],
                        types: [idType],
                        promos: [idPromo],
                        complaints: [idComplaint],
                        ratings: [idRating],
                        drinkApplications: [idDrinkApp],
                        departments: [idDepartment],
                        multilang: [idMultilang],
                        days: [idDay],
                        hashTags: [idHashTag],
                        tops: [idTop],
                        boss: idBoss
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.location.toString().should.equal(idLocation.toString());
                res.body.images.should.lengthOf(1);
                res.body.boss.toString().should.equal(idBoss.toString());
                res.body.types.should.lengthOf(1);
                res.body.promos.should.lengthOf(1);
                res.body.complaints.should.lengthOf(1);
                res.body.ratings.should.lengthOf(1);
                res.body.drinkApplications.should.lengthOf(1);
                res.body.departments.should.lengthOf(1);
                res.body.multilang.should.lengthOf(1);
                res.body.days.should.lengthOf(1);
                res.body.hashTags.should.lengthOf(1);
                res.body.tops.should.lengthOf(1);

                let location = await Location.findById(idLocation);
                let boss = await Client.findById(idBoss);
                let promo = await Promo.findById(idPromo);
                let complaint = await Complaint.findById(idComplaint);
                let rating = await Rating.findById(idRating);
                let drinkApp = await DrinkApplication.findById(idDrinkApp);
                let department = await Department.findById(idDepartment);
                let multillang = await Multilang.findById(idMultilang);
                let day = await Day.findById(idDay);
                let hashTag = await HashTag.findById(idHashTag);
                let top = await TopPlace.findById(idTop);

                location.place.toString().should.equal(res.body._id.toString());
                boss.ownPlaces.should.lengthOf(1);
                promo.place.toString().should.equal(res.body._id.toString());
                complaint.place.toString().should.equal(res.body._id.toString());
                rating.place.toString().should.equal(res.body._id.toString());
                drinkApp.place.toString().should.equal(res.body._id.toString());
                department.place.toString().should.equal(res.body._id.toString());
                multillang.place.toString().should.equal(res.body._id.toString());
                day.place.toString().should.equal(res.body._id.toString());
                hashTag.places.should.lengthOf(1);
                top.place.toString().should.equal(res.body._id.toString());
            });
        });
    });
});