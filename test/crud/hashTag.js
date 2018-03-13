require('../../config/path');
let HashTag = require('../../models/HashTag');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('API endpoint /api/hashTags', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('GET', function (desc) {
        let id1 = new mongoose.Types.ObjectId;
        let id2 = new mongoose.Types.ObjectId;
        before(async function () {
            await HashTag.create({
                _id: id1,
                value: 'b'
            });
            await HashTag.create({
                _id: id2,
                value: 'a'
            });
        });
        after(async function () {
            await HashTag.remove({});
        });

        it('(normal get)should return list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/hashTags');
            res.status.should.equal(200);
            res.body.should.be.a('array');
            res.body.length.should.be.above(0);
        });
        it('(normal get)should return model by id', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/hashTags/' + id1);
            res.status.should.equal(200);
            res.body.should.have.property('_id');
        });
        it('(wrong id)should return null', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/hashTags/' + new mongoose.Types.ObjectId);
            res.status.should.equal(200);
            should.not.exist(res.body);
        });
        it('(normal get with select) should return list of models with selected fields', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/hashTags')
                .query({fields: 'value,-_id'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].should.have.property('value').but.not.have.property('_id');
        });
        it('(normal get with sorting) should return sorted list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/hashTags')
                .query({sort: 'value'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].value.should.equal('a');
        });
        it('(normal get with query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/hashTags')
                .query({query: JSON.stringify({value: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(1);
            res.body[0].value.should.equal('a');
        });
        it('(wrong query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/hashTags')
                .query({query: JSON.stringify({wrongField: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(0);
        });
    });

    describe('POST', function () {
        after(async function () {
            await HashTag.remove({});
        });

        it('(normal create with non existing place)should return created model', async function () {
            let res = await chai.request('localhost:3000')
                .post('/api/hashTags')
                .send({
                    value: 'eng',
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.value.should.equal('eng');
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .post('/api/hashTags/')
                    .send({
                        unknownField: 'aaaa'
                    });
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
        it('(missing required)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .post('/api/hashTags/');
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
    });

    describe('PUT', function () {
        let id = new mongoose.Types.ObjectId;
        before(async function () {
            await HashTag.create({
                _id: id,
                value: 'w'
            });
        });
        after(async function () {
            await HashTag.remove({});
        });

        it('(normal update)should update model', async function () {
            let res = await chai.request('localhost:3000')
                .put('/api/hashTags/' + id)
                .send({
                    value: 'fr'
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.value.should.equal('fr');
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/hashTags/' + id)
                    .send({
                        unknownField: 'aaaa'
                    });
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
        it('(invalid id)should return status 404', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/hashTags/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });

    describe('DELETE', function () {
        it('(normal delete)should return status 204', async function () {
            let currency = await HashTag.create({
                value: 'uk'
            });
            let res = await chai.request('localhost:3000')
                .delete('/api/hashTags/' + currency._id);
            res.status.should.equal(204);
        });
        it('(wrong id)should return status 404', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .delete('/api/hashTags/' +new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });
});