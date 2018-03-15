require('../../config/path');
let TopPlace = require('../../models/TopPlace');
let Place = require('../../models/Place');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('top place relations', function () {
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
                await TopPlace.remove();
                await Place.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/topPlaces')
                    .send({
                        startDate: new Date(),
                        endDate: new Date(),
                        price: 72555,
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.place.should.equal(idPlace.toString());
                let place = await Place.findById(idPlace);
                place.tops.should.lengthOf(1);
                place.tops.should.include(res.body._id);
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/topPlaces')
                        .send({
                            startDate: new Date(),
                            endDate: new Date(),
                            price: 72555,
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
                let topPlace = await TopPlace.create({
                    _id: idComplaint,
                    startDate: new Date(),
                    endDate: new Date(),
                    price: 72555
                });
            });
            afterEach(async function () {
                await TopPlace.remove();
                await Place.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/topPlaces/' + idComplaint)
                    .send({
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.place.should.equal(idPlace.toString());
                let place = await Place.findById(idPlace);
                place.tops.should.lengthOf(1);
                place.tops.should.include(res.body._id);
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var complaint = await TopPlace.create({
                        startDate: new Date(),
                        endDate: new Date(),
                        price: 72555,
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/topPlaces/' + complaint._id)
                        .send({
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    complaint = await TopPlace.findById(complaint._id);
                    should.equal(complaint.place,undefined);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var top = new TopPlace({
                        startDate: new Date(),
                        endDate: new Date(),
                        price: 72555,
                        place : idPlace
                    });
                    top = await top.supersave();
                    let res = await chai.request('localhost:3000')
                        .put('/api/topPlaces/' + top._id)
                        .send({
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    top = await TopPlace.findById(top._id);
                    let place = await Place.findById(idPlace);
                    top.place.should.eql(place._id);
                    place.tops.should.include(top._id);
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
                await TopPlace.remove();
                await Place.remove();
            });
            it('normal delete model with relations', async function () {
                let top = new TopPlace({
                    startDate: new Date(),
                    endDate: new Date(),
                    price: 72555,
                    place : idPlace
                });
                top = await top.supersave();
                let res = await chai.request('localhost:3000')
                    .delete('/api/topPlaces/' + top._id);
                res.status.should.equal(204);
                let place = await Place.findById(idPlace);
                place.tops.should.lengthOf(0);
                place.tops.should.not.include(top._id);
            });
        });
    });
});