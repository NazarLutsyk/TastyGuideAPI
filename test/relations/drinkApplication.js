require('../../config/path');
let DrinkApplication = require('../../models/DrinkApplication');
let Client = require('../../models/Client');
let Place = require('../../models/Place');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('drinkApp relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idClient = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let organizer = await Client.create({
                    _id: idClient,
                    name: 'Tasik',
                    surname: 'Parasik'
                });
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
            });
            afterEach(async function () {
                await DrinkApplication.remove();
                await Client.remove();
                await Place.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/drinkApplications')
                    .send({
                        date: new Date(),
                        organizer: idClient,
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.organizer.should.equal(idClient.toString());
                res.body.place.should.equal(idPlace.toString());
                let organizer = await Client.findById(idClient);
                let place = await Place.findById(idPlace);
                organizer.drinkApplications.should.lengthOf(1);
                place.drinkApplications.should.lengthOf(1);
                organizer.drinkApplications.should.include(res.body._id);
                place.drinkApplications.should.include(res.body._id);
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/drinkApplications')
                        .send({
                            date: new Date(),
                            organizer: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('update', function () {
            let idClient = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;
            let idComplaint = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let organizer = await Client.create({
                    _id: idClient,
                    name: 'Tasik',
                    surname: 'Parasik'
                });
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
                let complaint = await DrinkApplication.create({
                    _id: idComplaint,
                    date: new Date(),
                });
            });
            afterEach(async function () {
                await DrinkApplication.remove();
                await Client.remove();
                await Place.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/drinkApplications/' + idComplaint)
                    .send({
                        organizer: idClient,
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.organizer.should.equal(idClient.toString());
                res.body.place.should.equal(idPlace.toString());
                let organizer = await Client.findById(idClient);
                let place = await Place.findById(idPlace);
                organizer.drinkApplications.should.lengthOf(1);
                place.drinkApplications.should.lengthOf(1);
                organizer.drinkApplications.should.include(res.body._id);
                place.drinkApplications.should.include(res.body._id);
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var complaint = await DrinkApplication.create({
                        date: new Date(),
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/drinkApplications/' + complaint._id)
                        .send({
                            date: new Date(),
                            organizer: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    complaint = await DrinkApplication.findById(complaint._id);
                    should.equal(complaint.organizer,undefined);
                    should.equal(complaint.place,undefined);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var complaint = await DrinkApplication.create({
                        date: new Date(),
                        organizer : idClient,
                        place : idPlace
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/drinkApplications/' + complaint._id)
                        .send({
                            date: new Date(),
                            organizer: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    complaint = await DrinkApplication.findById(complaint._id);
                    let place = await Place.findById(idPlace);
                    let organizer = await Client.findById(idClient);
                    complaint.organizer.should.eql(organizer._id);
                    complaint.place.should.eql(place._id);
                    place.drinkApplications.should.include(complaint._id);
                    organizer.drinkApplications.should.include(complaint._id);
                }
            });
        });

        describe('delete', function () {
            let idClient = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;

            before(async function () {
                let organizer = await Client.create({
                    _id: idClient,
                    name: 'Tasik',
                    surname: 'Parasik'
                });
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
            });
            after(async function () {
                await DrinkApplication.remove();
                await Client.remove();
                await Place.remove();
            });
            it('normal delete model with relations', async function () {
                let complaint = await DrinkApplication.create({
                    date: new Date(),
                    organizer: idClient,
                    place: idPlace
                });
                let res = await chai.request('localhost:3000')
                    .delete('/api/drinkApplications/' + complaint._id);
                res.status.should.equal(204);
                let organizer = await Client.findById(idClient);
                let place = await Place.findById(idPlace);
                organizer.drinkApplications.should.lengthOf(0);
                place.drinkApplications.should.lengthOf(0);
                organizer.drinkApplications.should.not.include(complaint._id);
                place.drinkApplications.should.not.include(complaint._id);
            });
        });
    });
});