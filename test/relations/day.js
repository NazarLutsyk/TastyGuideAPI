require('../../config/path');
let Day = require('../../models/Day');
let Place = require('../../models/Place');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('day relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idPlace = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
            });
            afterEach(async function () {
                await Day.remove();
                await Place.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/days')
                    .send({
                        startTime: new Date(),
                        endTime: new Date(),
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.place.should.equal(idPlace.toString());
                let place = await Place.findById(idPlace);
                place.days.should.lengthOf(1);
                place.days.should.include(res.body._id);
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/days')
                        .send({
                            startTime: new Date(),
                            endTime: new Date(),
                            client: new mongoose.Types.ObjectId,
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('update', function () {
            let idPlace = new mongoose.Types.ObjectId;
            let idComplaint = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
                let topPlace = await Day.create({
                    _id: idComplaint,
                    startTime: new Date(),
                    endTime: new Date(),
                });
            });
            afterEach(async function () {
                await Day.remove();
                await Place.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/days/' + idComplaint)
                    .send({
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.place.should.equal(idPlace.toString());
                let place = await Place.findById(idPlace);
                place.days.should.lengthOf(1);
                place.days.should.include(res.body._id);
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var complaint = await Day.create({
                        startTime: new Date(),
                        endTime: new Date(),
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/days/' + complaint._id)
                        .send({
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    complaint = await Day.findById(complaint._id);
                    should.equal(complaint.place,undefined);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var complaint = await Day.create({
                        startTime: new Date(),
                        endTime: new Date(),
                        place : idPlace
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/days/' + complaint._id)
                        .send({
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    complaint = await Day.findById(complaint._id);
                    let place = await Place.findById(idPlace);
                    complaint.place.should.eql(place._id);
                    place.days.should.include(complaint._id);
                }
            });
        });

        describe('delete', function () {
            let idPlace = new mongoose.Types.ObjectId;

            before(async function () {
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
            });
            after(async function () {
                await Day.remove();
                await Place.remove();
            });
            it('normal delete model with relations', async function () {
                let complaint = await Day.create({
                    startTime: new Date(),
                    endTime: new Date(),
                    place: idPlace
                });
                let res = await chai.request('localhost:3000')
                    .delete('/api/days/' + complaint._id);
                res.status.should.equal(204);
                let place = await Place.findById(idPlace);
                place.days.should.lengthOf(0);
                place.days.should.not.include(complaint._id);
            });
        });
    });
});