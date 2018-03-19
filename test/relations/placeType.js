require('../../config/path');
let PlaceType = require('../../models/PlaceType');
let PlaceTypeMultilang = require('../../models/PlaceTypeMultilang');
let Place = require('../../models/Place');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('placeType relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idMultilang1 = new mongoose.Types.ObjectId;
            let idMultilang2 = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let multilnag1 = await PlaceTypeMultilang.create({
                    _id: idMultilang1,
                    name: 'nluasd@asd.ccc',
                });
                let multilang2 = await PlaceTypeMultilang.create({
                    _id: idMultilang2,
                    name: 'nluasd@asd.ccc',
                });
            });
            afterEach(async function () {
                await PlaceType.remove();
                await PlaceTypeMultilang.remove();
            });
            it('normal create model with used relations', async function () {
                let oldPlaceType = new PlaceType({
                });
                oldPlaceType = await oldPlaceType.superupdate(PlaceType,{
                    multilang: [idMultilang1,idMultilang2]
                });
                let res = await chai.request('localhost:3000')
                    .post('/api/placeTypes')
                    .send({
                        multilang: [idMultilang1, idMultilang2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.multilang.should.lengthOf(2);
                res.body.multilang.should.include(idMultilang1.toString());
                res.body.multilang.should.include(idMultilang2.toString());

                let oldMultilang1 = await PlaceTypeMultilang.findById(idMultilang1);
                let oldMultilang2 = await PlaceTypeMultilang.findById(idMultilang2);
                oldPlaceType = await PlaceType.findById(oldPlaceType);

                oldMultilang1.placeType.toString().should.equal(res.body._id.toString());
                oldMultilang2.placeType.toString().should.equal(res.body._id.toString());
                should.equal(oldPlaceType.multilang.length,0);
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/placeTypes')
                    .send({
                        multilang: [idMultilang1, idMultilang2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                let multilang1 = await PlaceTypeMultilang.findById(idMultilang1);
                let multilang2 = await PlaceTypeMultilang.findById(idMultilang2);
                res.body.multilang.should.lengthOf(2);
                res.body.multilang.should.include(multilang1._id.toString());
                res.body.multilang.should.include(multilang2._id.toString());
                multilang1.placeType.toString().should.equal(res.body._id.toString());
                multilang2.placeType.toString().should.equal(res.body._id.toString());
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/placeTypes')
                        .send({
                            multilang: [new mongoose.Types.ObjectId]
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('update', function () {
            let idMultilang1 = new mongoose.Types.ObjectId;
            let idMultilang2 = new mongoose.Types.ObjectId;
            let idPlaceType = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let multilang1 = await PlaceTypeMultilang.create({
                    _id: idMultilang1,
                    name: 'nluasd@asd.ccc',
                });
                let multilang2 = await PlaceTypeMultilang.create({
                    _id: idMultilang2,
                    name: 'nluasd@asd.ccc',
                });
                let placetype = await PlaceType.create({
                    _id: idPlaceType,
                });
            });
            afterEach(async function () {
                await PlaceType.remove();
                await PlaceTypeMultilang.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/placeTypes/' + idPlaceType)
                    .send({
                        multilang: [idMultilang1, idMultilang2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.multilang.should.include(idMultilang1.toString());
                res.body.multilang.should.include(idMultilang2.toString());
                let multilang1 = await PlaceTypeMultilang.findById(idMultilang1);
                let multilang2 = await PlaceTypeMultilang.findById(idMultilang2);
                multilang1.placeType.toString().should.equal(res.body._id.toString());
                multilang2.placeType.toString().should.equal(res.body._id.toString());
            });
            it('normal update model with relations', async function () {
                let placeType = new PlaceType({
                    multilang: [idMultilang1]
                });
                placeType = await placeType.supersave(PlaceType);
                let res = await chai.request('localhost:3000')
                    .put('/api/placeTypes/' + placeType._id)
                    .send({
                        multilang: [idMultilang1, idMultilang2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.multilang.should.lengthOf(2);
                res.body.multilang.should.include(idMultilang1.toString());
                res.body.multilang.should.include(idMultilang2.toString());
                let multilang1 = await PlaceTypeMultilang.findById(idMultilang1);
                let multilang2 = await PlaceTypeMultilang.findById(idMultilang2);
                multilang1.placeType.toString().should.equal(res.body._id.toString());
                multilang2.placeType.toString().should.equal(res.body._id.toString());
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var placeType = await PlaceType.create({
                        value: 'placeType',
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/placeTypes/' + placeType._id)
                        .send({
                            multilang: [new mongoose.Types.ObjectId],
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    placeType = await PlaceType.findById(placeType._id);
                    should.equal(placeType.multilang.length, 0);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var placeType = new PlaceType({
                        multilang: [idMultilang1, idMultilang2]
                    });
                    placeType = await placeType.supersave(PlaceType);
                    let res = await chai.request('localhost:3000')
                        .put('/api/placeTypes/' + placeType._id)
                        .send({
                            value: 'placeType',
                            multilang: [new mongoose.Types.ObjectId]
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    placeType = await PlaceType.findById(placeType._id);
                    let multilang1 = await PlaceTypeMultilang.findById(idMultilang2);
                    let multilang2 = await PlaceTypeMultilang.findById(idMultilang1);
                    placeType.multilang.should.include(multilang1._id);
                    placeType.multilang.should.include(multilang2._id);
                    multilang1.placeType.toString().should.equal(placeType._id.toString());
                    multilang2.placeType.toString().should.equal(placeType._id.toString());
                }
            });
            it('update model with used relations', async function () {
                let oldPlaceType = new PlaceType({
                });
                oldPlaceType = await oldPlaceType.superupdate(PlaceType,{
                    multilang: [idMultilang1,idMultilang2]
                });
                let newPlaceType = await PlaceType.create({
                });
                let res = await chai.request('localhost:3000')
                    .put('/api/placeTypes/'+newPlaceType._id)
                    .send({
                        multilang: [idMultilang2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.multilang.should.lengthOf(1);
                res.body.multilang.should.include(idMultilang2.toString());

                let oldMultilang1 = await PlaceTypeMultilang.findById(idMultilang1);
                let oldMultilang2 = await PlaceTypeMultilang.findById(idMultilang2);
                oldPlaceType = await PlaceType.findById(oldPlaceType._id);

                oldMultilang1.placeType.toString().should.equal(oldPlaceType._id.toString());
                oldMultilang2.placeType.toString().should.equal(res.body._id.toString());
                should.equal(res.body.multilang.length,1);
                should.equal(oldPlaceType.multilang.length,1);
            });
        });

        describe('delete', function () {
            let idMultilang1 = new mongoose.Types.ObjectId;
            let idMultilang2 = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;
            let placeType;
            before(async function () {
                await PlaceTypeMultilang.create({
                    _id: idMultilang1,
                    name : 'aas'
                });
                await PlaceTypeMultilang.create({
                    _id: idMultilang2,
                    name : 'aas'
                });
                placeType = new PlaceType({
                    multilang: [idMultilang1, idMultilang2]
                });
                placeType = await placeType.supersave(PlaceType);
                await Place.create({
                    _id : idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214',
                    types : [placeType]
                });
            });
            after(async function () {
                await PlaceType.remove();
                await PlaceTypeMultilang.remove();
                await Place.remove({});
            });
            it('normal delete model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .delete('/api/placeTypes/' + placeType._id);
                res.status.should.equal(204);
                let multilang1 = await PlaceTypeMultilang.findById(idMultilang1);
                let multilang2 = await PlaceTypeMultilang.findById(idMultilang2);
                let place = await Place.findById(idPlace);
                should.equal(place.types.length,0);
                should.equal(multilang1,null);
                should.equal(multilang2,null);
            });
        });
    });
});