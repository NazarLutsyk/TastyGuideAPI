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
                let placeType = await PlaceType.create({
                    multilang: [idMultilang1]
                });
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
                    var placeType = await PlaceType.create({
                        multilang: [idMultilang1, idMultilang2]
                    });
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
                placeType = await PlaceType.create({
                    multilang: [idMultilang1, idMultilang2]
                });
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
    describe('push pull', function () {
        let idMultilang = new mongoose.Types.ObjectId;
        beforeEach(async function () {
            await PlaceTypeMultilang.create({
                _id: idMultilang,
                name:'aas'
            });
        });
        afterEach(async function () {
            await PlaceTypeMultilang.remove({});
            await PlaceType.remove({});
        });
        describe('PUT', function () {
            it('should add relation to empty model', async function () {
                let placeType = await PlaceType.create({});
                let res = await chai.request('localhost:3000')
                    .put(`/api/placeTypes/${placeType._id}/multilangs/${idMultilang}`);
                let multilang = await PlaceTypeMultilang.findById(idMultilang);
                placeType = await PlaceType.findById(placeType._id);
                res.status.should.equal(201);
                multilang.placeType.toString().should.equal(placeType._id.toString());
                placeType.multilang.should.include(multilang._id.toString());
            });
            it('should add relation to not empty model', async function () {
                let multilang1 = await PlaceTypeMultilang.create({name : 'asd'});
                let placeType = await PlaceType.create({multilang: [multilang1._id]});
                let res = await chai.request('localhost:3000')
                    .put(`/api/placeTypes/${placeType._id}/multilangs/${idMultilang}`);
                multilang1 = await PlaceTypeMultilang.findById(multilang1._id);
                let multilang2 = await PlaceTypeMultilang.findById(idMultilang);
                placeType = await PlaceType.findById(placeType._id);
                res.status.should.equal(201);
                multilang1.placeType.toString().should.equal(placeType._id.toString());
                multilang2.placeType.toString().should.equal(placeType._id.toString());
                placeType.multilang.should.include(multilang1._id.toString());
                placeType.multilang.should.include(multilang2._id.toString());
                placeType.multilang.should.lengthOf(2);
            });
            it('should not add duplicated relation', async function () {
                let placeType = await PlaceType.create({multilang: [idMultilang]});
                let res = await chai.request('localhost:3000')
                    .put(`/api/placeTypes/${placeType._id}/multilangs/${idMultilang}`);
                let multilang = await PlaceTypeMultilang.findById(idMultilang);
                placeType = await PlaceType.findById(placeType._id);
                res.status.should.equal(201);
                multilang.placeType.toString().should.equal(placeType._id.toString());
                placeType.multilang.should.include(multilang._id.toString());
                placeType.multilang.should.lengthOf(1);
            });
            it('should not add wrong relation', async function () {
                try {
                    var placeType = await PlaceType.create({});
                    let res = await chai.request('localhost:3000')
                        .put(`/api/placeTypes/${placeType._id}/multilangs/${new mongoose.Types.ObjectId}`);
                    if (res.status) should.fail();
                } catch (e) {
                    placeType = await PlaceType.findById(placeType._id);
                    e.status.should.equal(400);
                    should.equal(placeType.multilang.length, 0);
                }
            });
        });
        describe('DELETE', function () {
            let idMultilang = new mongoose.Types.ObjectId;
            let idPLaceType = new mongoose.Types.ObjectId;
            beforeEach(async function () {
                let multilang = await PlaceTypeMultilang.create({
                    _id: idMultilang,
                    name: 'nluasd@asd.ccc',
                });
                await PlaceType.create({
                    _id : idPLaceType,
                    multilang: [multilang]
                });
            });
            afterEach(async function () {
                await PlaceTypeMultilang.remove({});
                await PlaceType.remove({});
            });
            it('should delete relation', async function () {
                let res = await chai.request('localhost:3000')
                    .delete(`/api/placeTypes/${idPLaceType}/multilangs/${idMultilang}`);
                let multilang = await PlaceTypeMultilang.findById(idMultilang);
                let placeType = await PlaceType.findById(idPLaceType);
                res.status.should.equal(204);
                should.equal(multilang.placeType,null);
                should.equal(placeType.multilang.length,0);
            });
            it('should not remove wrong relation', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .delete(`/api/placeTypes/${idPLaceType}/multilangs/${new mongoose.Types.ObjectId}`);
                } catch (e) {
                    let multilang = await PlaceTypeMultilang.findById(idMultilang);
                    let placeType = await PlaceType.findById(idPLaceType);
                    e.status.should.equal(400);
                    should.equal(placeType.multilang.length, 1);
                    should.equal(multilang.placeType.toString(), placeType._id.toString());
                }
            });
        });
    });
});