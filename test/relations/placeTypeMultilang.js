require('../../config/path');
let PlaceTypeMultilang = require('../../models/PlaceTypeMultilang');
let PlaceType = require('../../models/PlaceType');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('place type multilang relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idPlaceType = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let placeType = await PlaceType.create({
                    _id: idPlaceType,
                });
            });
            afterEach(async function () {
                await PlaceTypeMultilang.remove();
                await PlaceType.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/placeTypeMultilangs')
                    .send({
                        name : 'asdasd',
                        placeType: idPlaceType
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.placeType.should.equal(idPlaceType.toString());
                let placeType = await PlaceType.findById(idPlaceType);
                placeType.multilang.should.include(res.body._id.toString());
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/placeTypeMultilangs')
                        .send({
                            name : 'asdasd',
                            placeType: new mongoose.Types.ObjectId,
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('update', function () {
            let idPlaceType = new mongoose.Types.ObjectId;
            let idMultilang = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let placeType = await PlaceType.create({
                    _id: idPlaceType,
                });
                let multilang = await PlaceTypeMultilang.create({
                    _id: idMultilang,
                    name : 'asdasd',
                });
            });
            afterEach(async function () {
                await PlaceTypeMultilang.remove();
                await PlaceType.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/placeTypeMultilangs/' + idMultilang)
                    .send({
                        placeType: idPlaceType
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.placeType.should.equal(idPlaceType.toString());
                let placeType = await PlaceType.findById(idPlaceType);
                placeType.multilang.should.include(res.body._id.toString());
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var multilang = await PlaceTypeMultilang.create({
                        name : 'asdasd',
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/placeTypeMultilangs/' + multilang._id)
                        .send({
                            placeType: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    multilang = await PlaceTypeMultilang.findById(multilang._id);
                    should.equal(multilang.placeType,undefined);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var multilang = new PlaceTypeMultilang({
                        name : 'asdasd',
                        placeType : idPlaceType
                    });
                    multilang = await multilang.supersave();

                    let res = await chai.request('localhost:3000')
                        .put('/api/placeTypeMultilangs/' + multilang._id)
                        .send({
                            placeType: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    multilang = await PlaceTypeMultilang.findById(multilang._id);
                    let placeType = await PlaceType.findById(idPlaceType);
                    multilang.placeType.should.eql(placeType._id);
                    placeType.multilang.should.include(multilang._id);
                }
            });
        });

        describe('delete', function () {
            let idPlaceType = new mongoose.Types.ObjectId;

            before(async function () {
                let placeType = await PlaceType.create({
                    _id: idPlaceType,
                });
            });
            after(async function () {
                await PlaceTypeMultilang.remove();
                await PlaceType.remove();
            });
            it('normal delete model with relations', async function () {
                let multilang = new PlaceTypeMultilang({
                    name : 'asdasd',
                    placeType : idPlaceType
                });
                multilang = await multilang.supersave();
                let res = await chai.request('localhost:3000')
                    .delete('/api/placeTypeMultilangs/' + multilang._id);
                res.status.should.equal(204);
                let placeType = await PlaceType.findById(idPlaceType);
                should.equal(placeType.multilang.length,0)
            });
        });
    });
});