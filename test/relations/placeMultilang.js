require('../../config/path');
let PlaceMultilang = require('../../models/PlaceMultilang');
let Place = require('../../models/Place');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('place multilang relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idPlace = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let place = await Place.create({
                    _id: idPlace,
                    phone : '5445648724532',
                    email : 'asda@dsaas.adas'
                });
            });
            afterEach(async function () {
                await PlaceMultilang.remove();
                await Place.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/placeMultilangs')
                    .send({
                        name : 'asdasd',
                        description : 'asda',
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.place.should.equal(idPlace.toString());
                let place = await Place.findById(idPlace);
                place.multilang.should.include(res.body._id.toString());
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/placeMultilangs')
                        .send({
                            name : 'asdasd',
                            description : 'asda',
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
            let idMultilang = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let place = await Place.create({
                    _id: idPlace,
                    phone : '5445648724532',
                    email : 'asda@dsaas.adas'
                });
                let multilang = await PlaceMultilang.create({
                    _id: idMultilang,
                    name : 'asdasd',
                    description : 'asda',
                });
            });
            afterEach(async function () {
                await PlaceMultilang.remove();
                await Place.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/placeMultilangs/' + idMultilang)
                    .send({
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.place.should.equal(idPlace.toString());
                let place = await Place.findById(idPlace);
                place.multilang.should.include(res.body._id.toString());
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var multilang = await PlaceMultilang.create({
                        name : 'asdasd',
                        description : 'asda',
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/placeMultilangs/' + multilang._id)
                        .send({
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    multilang = await PlaceMultilang.findById(multilang._id);
                    should.equal(multilang.place,undefined);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var multilang = new PlaceMultilang({
                        name : 'asdasd',
                        description : 'asda',
                        place : idPlace
                    });
                    multilang = await multilang.supersave();

                    let res = await chai.request('localhost:3000')
                        .put('/api/placeMultilangs/' + multilang._id)
                        .send({
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    multilang = await PlaceMultilang.findById(multilang._id);
                    let place = await Place.findById(idPlace);
                    multilang.place.should.eql(place._id);
                    place.multilang.should.include(multilang._id);
                }
            });
        });

        describe('delete', function () {
            let idPlace = new mongoose.Types.ObjectId;

            before(async function () {
                let place = await Place.create({
                    _id: idPlace,
                    phone : '5445648724532',
                    email : 'asda@dsaas.adas'
                });
            });
            after(async function () {
                await PlaceMultilang.remove();
                await Place.remove();
            });
            it('normal delete model with relations', async function () {
                let multilang = new PlaceMultilang({
                    name : 'asdasd',
                    description : 'asda',
                    place : idPlace
                });
                multilang = await multilang.supersave();
                let res = await chai.request('localhost:3000')
                    .delete('/api/placeMultilangs/' + multilang._id);
                res.status.should.equal(204);
                let place = await Place.findById(idPlace);
                should.equal(place.multilang.length,0)
            });
        });
    });
});