require('../../config/path');
let Place = require('../../models/Place');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('API endpoint /api/places', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('GET', function (desc) {
        let id1 = new mongoose.Types.ObjectId;
        let id2 = new mongoose.Types.ObjectId;
        before(async function () {
            await Place.create({
                _id: id1,
                phone : '385648754211',
                email : 'q@q.com',
                averagePrice : 500,
                reviews : 100
            });
            await Place.create({
                _id: id2,
                phone : '385648754211',
                email : 'q@q.com',
                averagePrice : 400,
                reviews : 100
            });
        });
        after(async function () {
            await Place.remove({});
        });

        it('(normal get)should return list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/places');
            res.status.should.equal(200);
            res.body.should.be.a('array');
            res.body.length.should.be.above(0);
        });
        it('(normal get)should return model by id', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/places/' + id1);
            res.status.should.equal(200);
            res.body.should.have.property('_id');
        });
        it('(wrong id)should return null', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/places/' + new mongoose.Types.ObjectId);
            res.status.should.equal(200);
            should.not.exist(res.body);
        });
        it('(normal get with select) should return list of models with selected fields', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/places')
                .query({fields: 'phone,-_id'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].should.have.property('phone').but.not.have.property('_id');
        });
        it('(normal get with sorting) should return sorted list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/places')
                .query({sort: 'averagePrice'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].averagePrice.should.equal(400);
        });
        it('(normal get with query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/places')
                .query({query: JSON.stringify({averagePrice: 400})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(1);
            res.body[0].averagePrice.should.equal(400);
        });
        it('(wrong query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/places')
                .query({query: JSON.stringify({wrongField: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(0);
        });
    });

    describe('POST', function () {
        after(async function () {
            await Place.remove({});
        });

        it('(normal create)should return created model', async function () {
            let res = await chai.request('localhost:3000')
                .post('/api/places')
                .send({
                    phone : '385648754211',
                    email : 'q@q.com',
                    averagePrice : 400,
                    reviews : 100
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.phone.should.equal('385648754211');
            res.body.email.should.equal('q@q.com');
            res.body.averagePrice.should.equal(400);
            res.body.reviews.should.equal(100);
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .post('/api/places/')
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
                    .post('/api/places/');
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
    });

    describe('PUT', function () {
        let id = new mongoose.Types.ObjectId;
        before(async function () {
            await Place.create({
                _id: id,
                phone : '385648754211',
                email : 'q@q.com',
                averagePrice : 400,
                reviews : 100
            });
        });
        after(async function () {
            await Place.remove({});
        });

        it('(normal update)should update model', async function () {
            let res = await chai.request('localhost:3000')
                .put('/api/places/' + id)
                .send({
                    reviews: 200
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.reviews.should.equal(200);
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/places/' + id)
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
                    .put('/api/places/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });

    describe('DELETE', function () {
        it('(normal delete)should return status 204', async function () {
            let currency = await Place.create({
                phone : '385648754211',
                email : 'q@q.com',
                averagePrice : 400,
                reviews : 100
            });
            let res = await chai.request('localhost:3000')
                .delete('/api/places/' + currency._id);
            res.status.should.equal(204);
        });
        it('(wrong id)should return status 404', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .delete('/api/places/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });
});