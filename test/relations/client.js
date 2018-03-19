require('../../config/path');
let Client = require('../../models/Client');
let Complaint = require('../../models/Complaint');
let DrinkApplication = require('../../models/DrinkApplication');
let Rating = require('../../models/Rating');
let Department = require('../../models/Department');
let Place = require('../../models/Place');
let Message = require('../../models/Message');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('client relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('update', function () {
            let idComplaint = new mongoose.Types.ObjectId;
            let idDrinkApp = new mongoose.Types.ObjectId;
            let idRating = new mongoose.Types.ObjectId;
            let idDepartment = new mongoose.Types.ObjectId;
            let idOwnPlace = new mongoose.Types.ObjectId;
            let idFavoritePlace = new mongoose.Types.ObjectId;
            let idClient = new mongoose.Types.ObjectId;
            beforeEach(async function () {
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
                await Place.create({
                    _id: idOwnPlace,
                    phone: '54575421552',
                    email: 'asda@asd.sds',
                });
                await Place.create({
                    _id: idFavoritePlace,
                    phone: '54575421552',
                    email: 'asda@asd.sds',
                });
                await Client.create({
                    _id: idClient,
                    name: 'asdas',
                    surname: 'asds'
                });
            });
            afterEach(async function () {
                await Complaint.remove();
                await Rating.remove();
                await DrinkApplication.remove();
                await Department.remove();
                await Place.remove();
                await Client.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/clients/' + idClient)
                    .send({
                        complaints: [idComplaint],
                        ratings: [idRating],
                        drinkApplications: [idDrinkApp],
                        departments: [idDepartment],
                        ownPlaces: [idOwnPlace],
                        favoritePlaces: [idFavoritePlace]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.complaints.should.lengthOf(1);
                res.body.ratings.should.lengthOf(1);
                res.body.drinkApplications.should.lengthOf(1);
                res.body.departments.should.lengthOf(1);
                res.body.ownPlaces.should.lengthOf(1);
                res.body.favoritePlaces.should.lengthOf(1);

                res.body.complaints.should.include(idComplaint.toString());
                res.body.ratings.should.include(idRating.toString());
                res.body.drinkApplications.should.include(idDrinkApp.toString());
                res.body.departments.should.include(idDepartment.toString());
                res.body.ownPlaces.should.include(idOwnPlace.toString());
                res.body.favoritePlaces.should.include(idFavoritePlace.toString());

                let complaint = await Complaint.findById(idComplaint);
                let rating = await Rating.findById(idRating);
                let drinkApp = await DrinkApplication.findById(idDrinkApp);
                let department = await Department.findById(idDepartment);
                let ownPlace = await Place.findById(idOwnPlace);

                complaint.client.toString().should.equal(res.body._id.toString());
                rating.client.toString().should.equal(res.body._id.toString());
                drinkApp.organizer.toString().should.equal(res.body._id.toString());
                department.client.toString().should.equal(res.body._id.toString());
                ownPlace.boss.toString().should.equal(res.body._id.toString());
            });
            it('normal update model with relations', async function () {
                let client = await Client.create({
                    name: 'asda',
                    surname: 'asd'
                });
                let complaintToAdd = await Complaint.create({
                    value: 'asds'
                });
                let drinkApplicationToAdd = await DrinkApplication.create({
                    date: new Date()
                });
                let ratingToAdd = await Rating.create({});
                let departmentToAdd = await Department.create({});
                let ownPlaceToAdd = await Place.create({
                    phone: '54575421552',
                    email: 'asda@asd.sds',
                });
                let favoritePlaceToAdd = await Place.create({
                    phone: '54575421552',
                    email: 'asda@asd.sds',
                });
                client = await client.superupdate({
                    complaints: [idComplaint],
                    ratings: [idRating],
                    drinkApplications: [idDrinkApp],
                    departments: [idDepartment],
                    ownPlaces: [idOwnPlace],
                    favoritePlaces: [idFavoritePlace]
                });
                let res = await chai.request('localhost:3000')
                    .put('/api/clients/' + client._id)
                    .send({
                        complaints: [idComplaint, complaintToAdd._id],
                        ratings: [idRating, ratingToAdd._id],
                        drinkApplications: [idDrinkApp, drinkApplicationToAdd._id],
                        departments: [idDepartment, departmentToAdd._id],
                        ownPlaces: [idOwnPlace, ownPlaceToAdd._id],
                        favoritePlaces: [idFavoritePlace, favoritePlaceToAdd._id]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');

                res.body.complaints.should.lengthOf(2);
                res.body.ratings.should.lengthOf(2);
                res.body.drinkApplications.should.lengthOf(2);
                res.body.departments.should.lengthOf(2);
                res.body.ownPlaces.should.lengthOf(2);
                res.body.favoritePlaces.should.lengthOf(2);

                res.body.complaints.should.include(idComplaint.toString());
                res.body.complaints.should.include(complaintToAdd._id.toString());
                res.body.ratings.should.include(idRating.toString());
                res.body.ratings.should.include(ratingToAdd._id.toString());
                res.body.drinkApplications.should.include(idDrinkApp.toString());
                res.body.drinkApplications.should.include(drinkApplicationToAdd._id.toString());
                res.body.departments.should.include(idDepartment.toString());
                res.body.departments.should.include(departmentToAdd._id.toString());
                res.body.ownPlaces.should.include(idOwnPlace.toString());
                res.body.ownPlaces.should.include(ownPlaceToAdd._id.toString());
                res.body.favoritePlaces.should.include(idFavoritePlace.toString());
                res.body.favoritePlaces.should.include(favoritePlaceToAdd._id.toString());

                let complaint1 = await Complaint.findById(idComplaint);
                let complaint2 = await Complaint.findById(complaintToAdd._id);
                let rating1 = await Rating.findById(idRating);
                let rating2 = await Rating.findById(ratingToAdd._id);
                let drinkApp1 = await DrinkApplication.findById(idDrinkApp);
                let drinkApp2 = await DrinkApplication.findById(drinkApplicationToAdd._id);
                let department1 = await Department.findById(idDepartment);
                let department2 = await Department.findById(departmentToAdd._id);
                let ownPlace1 = await Place.findById(idOwnPlace);
                let ownPlace2 = await Place.findById(ownPlaceToAdd._id);

                complaint1.client.toString().should.equal(res.body._id.toString());
                complaint2.client.toString().should.equal(res.body._id.toString());
                rating1.client.toString().should.equal(res.body._id.toString());
                rating2.client.toString().should.equal(res.body._id.toString());
                drinkApp1.organizer.toString().should.equal(res.body._id.toString());
                drinkApp2.organizer.toString().should.equal(res.body._id.toString());
                department1.client.toString().should.equal(res.body._id.toString());
                department2.client.toString().should.equal(res.body._id.toString());
                ownPlace1.boss.toString().should.equal(res.body._id.toString());
                ownPlace2.boss.toString().should.equal(res.body._id.toString());
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .put('/api/clients/' + idClient)
                        .send({
                            complaints: [new mongoose.Types.ObjectId],
                            ratings: [new mongoose.Types.ObjectId],
                            drinkApplications: [new mongoose.Types.ObjectId],
                            departments: [new mongoose.Types.ObjectId],
                            ownPlaces: [new mongoose.Types.ObjectId],
                            favoritePlaces: [new mongoose.Types.ObjectId]
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    let client = await Client.findById(idClient);
                    should.equal(client.complaints.length, 0);
                    should.equal(client.ratings.length, 0);
                    should.equal(client.drinkApplications.length, 0);
                    should.equal(client.departments.length, 0);
                    should.equal(client.ownPlaces.length, 0);
                    should.equal(client.favoritePlaces.length, 0);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var client = await Client.findById(idClient);
                    client = await client.superupdate({
                        complaints: [idComplaint],
                        ratings: [idRating],
                        drinkApplications: [idDrinkApp],
                        departments: [idDepartment],
                        ownPlaces: [idOwnPlace],
                        favoritePlaces: [idFavoritePlace]
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/clients/' + client._id)
                        .send({
                            complaints: [new mongoose.Types.ObjectId],
                            ratings: [new mongoose.Types.ObjectId],
                            drinkApplications: [new mongoose.Types.ObjectId],
                            departments: [new mongoose.Types.ObjectId],
                            ownPlaces: [new mongoose.Types.ObjectId],
                            favoritePlaces: [new mongoose.Types.ObjectId]
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);

                    client = await Client.findById(idClient);

                    client.complaints.should.lengthOf(1);
                    client.ratings.should.lengthOf(1);
                    client.drinkApplications.should.lengthOf(1);
                    client.departments.should.lengthOf(1);
                    client.ownPlaces.should.lengthOf(1);
                    client.favoritePlaces.should.lengthOf(1);

                    client.complaints.should.include(idComplaint.toString());
                    client.ratings.should.include(idRating.toString());
                    client.drinkApplications.should.include(idDrinkApp.toString());
                    client.departments.should.include(idDepartment.toString());
                    client.ownPlaces.should.include(idOwnPlace.toString());
                    client.favoritePlaces.should.include(idFavoritePlace.toString());

                    let complaint1 = await Complaint.findById(idComplaint);
                    let rating1 = await Rating.findById(idRating);
                    let drinkApp1 = await DrinkApplication.findById(idDrinkApp);
                    let department1 = await Department.findById(idDepartment);
                    let ownPlace1 = await Place.findById(idOwnPlace);

                    complaint1.client.toString().should.equal(client._id.toString());
                    rating1.client.toString().should.equal(client._id.toString());
                    drinkApp1.organizer.toString().should.equal(client._id.toString());
                    department1.client.toString().should.equal(client._id.toString());
                    ownPlace1.boss.toString().should.equal(client._id.toString());
                }
            });
        });

        describe('delete', function () {
            let idComplaint = new mongoose.Types.ObjectId;
            let idDrinkApp = new mongoose.Types.ObjectId;
            let idRating = new mongoose.Types.ObjectId;
            let idDepartment = new mongoose.Types.ObjectId;
            let idOwnPlace = new mongoose.Types.ObjectId;
            let idFavoritePlace = new mongoose.Types.ObjectId;
            let idClient = new mongoose.Types.ObjectId;
            let idMessageSender = new mongoose.Types.ObjectId;
            let idMessageReceiver = new mongoose.Types.ObjectId;
            beforeEach(async function () {
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
                await Place.create({
                    _id: idOwnPlace,
                    phone: '54575421552',
                    email: 'asda@asd.sds',
                });
                await Place.create({
                    _id: idFavoritePlace,
                    phone: '54575421552',
                    email: 'asda@asd.sds',
                });
                await Message.create({
                    _id: idMessageSender,
                    value: 'aaa',
                    sender: idClient
                });
                await Message.create({
                    _id: idMessageReceiver,
                    value: 'aaa',
                    receiver: idClient
                });
                let client = await Client.create({
                    _id: idClient,
                    name: 'asdas',
                    surname: 'asds'
                });
                await client.superupdate({
                    complaints: [idComplaint],
                    ratings: [idRating],
                    drinkApplications: [idDrinkApp],
                    departments: [idDepartment],
                    ownPlaces: [idOwnPlace],
                    favoritePlaces: [idFavoritePlace]
                });
            });
            afterEach(async function () {
                await Complaint.remove();
                await Rating.remove();
                await DrinkApplication.remove();
                await Department.remove();
                await Place.remove();
                await Client.remove();
                await Message.remove();
            });
            it('normal delete model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .delete('/api/clients/' + idClient);
                res.status.should.equal(204);

                let complaint1 = await Complaint.findById(idComplaint);
                let rating1 = await Rating.findById(idRating);
                let drinkApp1 = await DrinkApplication.findById(idDrinkApp);
                let department1 = await Department.findById(idDepartment);
                let ownPlace1 = await Place.findById(idOwnPlace);
                let messageSender1 = await Message.findById(idMessageSender);
                let messageReceiver1 = await Message.findById(idMessageReceiver);

                should.equal(complaint1, null);
                should.equal(rating1, null);
                should.equal(drinkApp1, null);
                should.equal(department1, null);
                should.equal(ownPlace1.boss, null);
                should.equal(messageSender1.sender, null);
                should.equal(messageReceiver1.receiver, null);
            });
        });
    });
});