require('../../config/path');
let Location = require('../../models/Location');
let Place = require('../../models/Place');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('location relations', function () {
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
                await Location.remove();
                await Place.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/locations')
                    .send({
                        ltg : 50,
                        lng : 100,
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.place.should.equal(idPlace.toString());
                let place = await Place.findById(idPlace);
                place.location.toString().should.equal(res.body._id.toString());
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/locations')
                        .send({
                            ltg : 50,
                            lng : 100,
                            place: new mongoose.Types.ObjectId,
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('update', function () {
            let idPlace = new mongoose.Types.ObjectId;
            let idLocation = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
                let topPlace = await Location.create({
                    _id: idLocation,
                    ltg : 50,
                    lng : 100,
                });
            });
            afterEach(async function () {
                await Location.remove();
                await Place.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/locations/' + idLocation)
                    .send({
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.place.should.equal(idPlace.toString());
                let place = await Place.findById(idPlace);
                place.location.toString().should.eql(res.body._id.toString());
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var complaint = await Location.create({
                        ltg : 50,
                        lng : 100,
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/locations/' + complaint._id)
                        .send({
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    complaint = await Location.findById(complaint._id);
                    should.equal(complaint.place,undefined);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var location = new Location({
                        ltg : 50,
                        lng : 100,
                        place : idPlace
                    });
                    location = await location.supersave();

                    let res = await chai.request('localhost:3000')
                        .put('/api/locations/' + location._id)
                        .send({
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    location = await Location.findById(location._id);
                    let place = await Place.findById(idPlace);
                    location.place.should.eql(place._id);
                    place.location.should.eql(location._id);
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
                await Location.remove();
                await Place.remove();
            });
            it('normal delete model with relations', async function () {
                let location = new Location({
                    ltg : 50,
                    lng : 100,
                    place : idPlace
                });
                location = await location.supersave();
                let res = await chai.request('localhost:3000')
                    .delete('/api/locations/' + location._id);
                res.status.should.equal(204);
                let place = await Place.findById(idPlace);
                should.equal(place.location,null)
            });
        });
    });
});