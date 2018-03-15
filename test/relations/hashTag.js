require('../../config/path');
let HashTag = require('../../models/HashTag');
let Place = require('../../models/Place');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('hashTag relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idPlace1 = new mongoose.Types.ObjectId;
            let idPlace2 = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let place1 = await Place.create({
                    _id: idPlace1,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
                let place2 = await Place.create({
                    _id: idPlace2,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
            });
            afterEach(async function () {
                await HashTag.remove();
                await Place.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/hashTags')
                    .send({
                        value: 'complaint',
                        places: [idPlace1, idPlace2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                let place1 = await Place.findById(idPlace1);
                let place2 = await Place.findById(idPlace2);
                res.body.places.should.lengthOf(2);
                res.body.places.should.include(idPlace1.toString());
                res.body.places.should.include(idPlace2.toString());
                place1.hashTags.should.lengthOf(1);
                place2.hashTags.should.lengthOf(1);
                place1.hashTags.should.include(res.body._id);
                place2.hashTags.should.include(res.body._id);
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/hashTags')
                        .send({
                            value: 'complaint',
                            places: [new mongoose.Types.ObjectId]
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('update', function () {
            let idPlace1 = new mongoose.Types.ObjectId;
            let idPlace2 = new mongoose.Types.ObjectId;
            let idHashTag = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let place1 = await Place.create({
                    _id: idPlace1,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
                let place2 = await Place.create({
                    _id: idPlace2,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
                let hasthTag = await HashTag.create({
                    _id: idHashTag,
                    value: 'hasthTag',
                });
            });
            afterEach(async function () {
                await HashTag.remove();
                await Place.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/hashTags/' + idHashTag)
                    .send({
                        places: [idPlace1, idPlace2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.places.should.include(idPlace1.toString());
                res.body.places.should.include(idPlace2.toString());
                let place1 = await Place.findById(idPlace1);
                let place2 = await Place.findById(idPlace2);
                place1.hashTags.should.lengthOf(1);
                place2.hashTags.should.lengthOf(1);
                place1.hashTags.should.include(res.body._id.toString());
                place2.hashTags.should.include(res.body._id.toString());
            });
            it('normal update model with relations', async function () {
                let hashTag = new HashTag({
                    value: 'aaa',
                    places: [idPlace1]
                });
                hashTag = await hashTag.supersave();
                let res = await chai.request('localhost:3000')
                    .put('/api/hashTags/' + hashTag._id)
                    .send({
                        places: [idPlace1, idPlace2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.places.should.lengthOf(2);
                res.body.places.should.include(idPlace1.toString());
                res.body.places.should.include(idPlace2.toString());
                let place1 = await Place.findById(idPlace1);
                let place2 = await Place.findById(idPlace2);
                place1.hashTags.should.lengthOf(1);
                place2.hashTags.should.lengthOf(1);
                place1.hashTags.should.include(res.body._id.toString());
                place2.hashTags.should.include(res.body._id.toString());
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var hashTag = await HashTag.create({
                        value: 'hashTag',
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/hashTags/' + hashTag._id)
                        .send({
                            value: 'hashTag',
                            places: [new mongoose.Types.ObjectId],
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    hashTag = await HashTag.findById(hashTag._id);
                    should.equal(hashTag.places.length, 0);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var hashTag = new HashTag({
                        value: 'hashTag',
                        places: [idPlace1, idPlace2]
                    });
                    hashTag = await hashTag.supersave();
                    let res = await chai.request('localhost:3000')
                        .put('/api/hashTags/' + hashTag._id)
                        .send({
                            value: 'hashTag',
                            places: [new mongoose.Types.ObjectId]
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    hashTag = await HashTag.findById(hashTag._id);
                    let place1 = await Place.findById(idPlace2);
                    let place2 = await Place.findById(idPlace1);
                    hashTag.places.should.include(place1._id);
                    hashTag.places.should.include(place2._id);
                    place1.hashTags.should.include(hashTag._id);
                    place2.hashTags.should.include(hashTag._id);
                }
            });
        });

        describe('delete', function () {
            let idPlace1 = new mongoose.Types.ObjectId;
            let idPlace2 = new mongoose.Types.ObjectId;

            before(async function () {
                let place1 = await Place.create({
                    _id: idPlace1,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
                let place2 = await Place.create({
                    _id: idPlace2,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
            });
            after(async function () {
                await HashTag.remove();
                await Place.remove();
            });
            it('normal delete model with relations', async function () {
                let hashTag = new HashTag({
                    value: 'hashTag',
                    places: [idPlace1, idPlace2]
                });
                hashTag = await hashTag.supersave();
                let res = await chai.request('localhost:3000')
                    .delete('/api/hashTags/' + hashTag._id);
                res.status.should.equal(204);
                let place1 = await Place.findById(idPlace1);
                let place2 = await Place.findById(idPlace2);
                place1.hashTags.should.not.include(hashTag._id.toString());
                place2.hashTags.should.not.include(hashTag._id.toString());
            });
        });
    });
    describe('push pull', function () {
        let idPlace = new mongoose.Types.ObjectId;
        beforeEach(async function () {
            await Place.create({
                _id: idPlace,
                email: 'nluasd@asd.ccc',
                phone: '38684854214'
            });
        });
        afterEach(async function () {
            await Place.remove({});
            await HashTag.remove({});
        });
        describe('PUT', function () {
            it('should add relation to empty model', async function () {
                let hashTag = await HashTag.create({value: 'aaaa'});
                let res = await chai.request('localhost:3000')
                    .put(`/api/hashTags/${hashTag._id}/places/${idPlace}`);
                let place = await Place.findById(idPlace);
                hashTag = await HashTag.findById(hashTag._id);
                res.status.should.equal(201);
                place.hashTags.should.lengthOf(1);
                place.hashTags.should.include(hashTag._id.toString());
                place.hashTags.should.lengthOf(1);
                hashTag.places.should.include(place._id.toString());
            });
            it('should add relation to not empty model', async function () {
                let place1 = await Place.create({
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
                let hashTag = new HashTag({value: 'aaaa', places: [place1._id]});
                hashTag = await hashTag.supersave();
                let res = await chai.request('localhost:3000')
                    .put(`/api/hashTags/${hashTag._id}/places/${idPlace}`);
                place1 = await Place.findById(place1._id);
                let place2 = await Place.findById(idPlace);
                hashTag = await HashTag.findById(hashTag._id);
                res.status.should.equal(201);
                place1.hashTags.should.lengthOf(1);
                place2.hashTags.should.lengthOf(1);
                place1.hashTags.should.include(hashTag._id.toString());
                place2.hashTags.should.include(hashTag._id.toString());
                hashTag.places.should.include(place1._id.toString());
                hashTag.places.should.include(place2._id.toString());
                hashTag.places.should.lengthOf(2);
            });
            it('should not add duplicated relation', async function () {
                let hashTag = HashTag({value: 'aaaa', places: [idPlace]});
                hashTag = await hashTag.supersave();
                let res = await chai.request('localhost:3000')
                    .put(`/api/hashTags/${hashTag._id}/places/${idPlace}`);
                let place = await Place.findById(idPlace);
                hashTag = await HashTag.findById(hashTag._id);
                res.status.should.equal(201);
                place.hashTags.should.lengthOf(1);
                place.hashTags.should.include(hashTag._id.toString());
                hashTag.places.should.include(place._id.toString());
                hashTag.places.should.lengthOf(1);
            });
            it('should not add wrong relation', async function () {
                try {
                    var hashTag = await HashTag.create({value: 'aaaa'});
                    let res = await chai.request('localhost:3000')
                        .put(`/api/hashTags/${hashTag._id}/places/${new mongoose.Types.ObjectId}`);
                    if (res.status) should.fail();
                } catch (e) {
                    hashTag = await HashTag.findById(hashTag._id);
                    e.status.should.equal(400);
                    should.equal(hashTag.places.length, 0);
                }
            });
        });
        describe('DELETE', function () {
            let idPlace = new mongoose.Types.ObjectId;
            let idHashTag = new mongoose.Types.ObjectId;
            beforeEach(async function () {
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
                let hashTag = new HashTag({
                    _id : idHashTag,
                    value: 'aa',
                    places: [place]
                });
                hashTag = await hashTag.supersave();
            });
            afterEach(async function () {
                await Place.remove({});
                await HashTag.remove({});
            });
            it('should delete relation', async function () {
                let res = await chai.request('localhost:3000')
                    .delete(`/api/hashTags/${idHashTag}/places/${idPlace}`);
                let place = await Place.findById(idPlace);
                let hashTag = await HashTag.findById(idHashTag);
                res.status.should.equal(204);
                should.equal(place.hashTags.length,0);
                should.equal(hashTag.places.length,0);
            });
            it('should not remove wrong relation', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .delete(`/api/hashTags/${idHashTag}/places/${new mongoose.Types.ObjectId}`);
                } catch (e) {
                    let place = await Place.findById(idPlace);
                    let hashTag = await HashTag.findById(idHashTag);
                    e.status.should.equal(400);
                    should.equal(hashTag.places.length, 1);
                    should.equal(place.hashTags.length, 1);
                }
            });
        });
    });
});