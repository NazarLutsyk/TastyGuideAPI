require('../../config/path');
let Rating = require('../../models/Rating');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('API endpoint /api/ratings', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('GET', function (desc) {
        let id1 = new mongoose.Types.ObjectId;
        let id2 = new mongoose.Types.ObjectId;
        before(async function () {
            await Rating.create({
                _id: id1,
                value: 5
            });
            await Rating.create({
                _id: id2,
                value: 3
            });
        });
        after(async function () {
            await Rating.remove({});
        });

        it('(normal get)should return list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/ratings');
            res.status.should.equal(200);
            res.body.should.be.a('array');
            res.body.length.should.be.above(0);
        });
        it('(normal get)should return model by id', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/ratings/' + id1);
            res.status.should.equal(200);
            res.body.should.have.property('_id');
        });
        it('(wrong id)should return null', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/ratings/' + new mongoose.Types.ObjectId);
            res.status.should.equal(200);
            should.not.exist(res.body);
        });
        it('(normal get with select) should return list of models with selected fields', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/ratings')
                .query({fields: 'value,-_id'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].should.have.property('value').but.not.have.property('_id');
        });
        it('(normal get with sorting) should return sorted list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/ratings')
                .query({sort: 'value'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].value.should.equal(3);
        });
        it('(normal get with query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/ratings')
                .query({query: JSON.stringify({value: 3})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(1);
            res.body[0].value.should.equal(3);
        });
        it('(wrong query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/ratings')
                .query({query: JSON.stringify({wrongField: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(0);
        });
    });

    describe('POST', function () {
        after(async function () {
            await Rating.remove({});
        });

        it('(normal create)should return created model', async function () {
            let res = await chai.request('localhost:3000')
                .post('/api/ratings')
                .send({
                    value: 5,
                    comment : 'comment',
                    price : 500
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.value.should.equal(5);
            res.body.comment.should.equal('comment');
            res.body.price.should.equal(500);
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .post('/api/ratings/')
                    .send({
                        unknownField: 'aaaa'
                    });
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
        it('(invalid value)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .post('/api/ratings/')
                    .send({
                        value: 100
                    });
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
    });

    describe('PUT', function () {
        let id = new mongoose.Types.ObjectId;
        before(async function () {
            await Rating.create({
                _id: id,
                value: 5
            });
        });
        after(async function () {
            await Rating.remove({});
        });

        it('(normal update)should update model', async function () {
            let res = await chai.request('localhost:3000')
                .put('/api/ratings/' + id)
                .send({
                    value: 3
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.value.should.equal(3);
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/ratings/' + id)
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
                    .put('/api/ratings/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
        it('(invalid value)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .post('/api/ratings/')
                    .send({
                        value: 100
                    });
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
    });

    describe('DELETE', function () {
        it('(normal delete)should return status 204', async function () {
            let currency = await Rating.create({
                value : 5
            });
            let res = await chai.request('localhost:3000')
                .delete('/api/ratings/' + currency._id);
            res.status.should.equal(204);
        });
        it('(wrong id)should return status 404', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .delete('/api/ratings/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });
});