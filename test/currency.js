require('../config/path');
let Currency = require('../models/Currency');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('API endpoint /api/currencies', function () {
    this.timeout(5000);
    mongoose.connect('mongodb://localhost/drinker');

    describe('GET', function () {
        let id1 = new mongoose.Types.ObjectId;
        let id2 = new mongoose.Types.ObjectId;
        before(async function () {
            await Currency.create({
                _id: id1,
                value: 'b'
            });
            await Currency.create({
                _id: id2,
                value: 'a'
            });
        });
        after(async function () {
            await Currency.remove({});
        });

        it('(normal get)should return list of models',async function () {
            chai.request('localhost:3000')
                .get('/api/currencies')
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.above(0);
                });
        });
        it('(normal get)should return model by id', async function () {
            chai.request('localhost:3000')
                .get('/api/currencies/' + id1)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                });
        });
        it('(wrong id)should return null',async function () {
            chai.request('localhost:3000')
                .get('/api/currencies/' + new mongoose.Types.ObjectId)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    should.not.exist(res.body);
                });
        });
        it('(normal get with select) should return list of models with selected fields', async function () {
            chai.request('localhost:3000')
                .get('/api/currencies')
                .query({fields: 'value,-_id'})
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    res.body[0].should.have.property('value').but.not.have.property('_id');
                })
        });
        it('(normal get with sorting) should return sorted list of models',async function () {
            chai.request('localhost:3000')
                .get('/api/currencies')
                .query({sort: 'value'})
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    res.body[0].value.should.equal('a');
                });
        });
        it('(normal get with query) should return queried list of models',async function () {
            chai.request('localhost:3000')
                .get('/api/currencies')
                .query({query: JSON.stringify({value: 'a'})})
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    res.body.should.have.lengthOf(1);
                    res.body[0].value.should.equal('a');
                });
        });
        it('(wrong query) should return queried list of models',async function () {
            chai.request('localhost:3000')
                .get('/api/currencies')
                .query({query: JSON.stringify({wrongField: 'a'})})
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    res.body.should.have.lengthOf(0);
                });
        });
    });

    describe('POST', function () {
        it('(normal create)should return created model',async function () {
            chai.request('localhost:3000')
                .post('/api/currencies')
                .send({
                    value: 'eng'
                })
                .end(function (err, res) {
                    res.status.should.equal(201);
                    res.body.should.be.a('object');
                    res.body.value.should.equal('eng');
                });
        });
        it('(unknown field)should return status 400',async function () {
            chai.request('localhost:3000')
                .post('/api/currencies/')
                .send({
                    unknownField: 'aaaa'
                })
                .end(function (err, res) {
                    res.status.should.equal(400);
                });
        });
        it('(missing required)should return status 400', async function () {
            chai.request('localhost:3000')
                .post('/api/currencies/')
                .end(function (err, res) {
                    res.status.should.equal(400);
                });
        });
    });

    describe('PUT', function () {
        let id = new mongoose.Types.ObjectId;
        before(async function () {
            await Currency.create({
                _id: id,
                value: 'w'
            });
        });
        after(async function () {
            await Currency.remove({});
        });

        it('(normal update)should update model',async function () {
            chai.request('localhost:3000')
                .put('/api/currencies/' + id)
                .send({
                    value: 'fr'
                })
                .end(function (err, res) {
                    res.status.should.equal(201);
                    res.body.should.be.a('object');
                    res.body.value.should.equal('fr');
                });
        });
        it('(unknown field)should return status 400',async function () {
            chai.request('localhost:3000')
                .put('/api/currencies/' + id)
                .send({
                    unknownField: 'aaaa'
                })
                .end(function (err, res) {
                    res.status.should.equal(400);
                });
        });
        it('(invalid id)should return status 400',async function () {
            chai.request('localhost:3000')
                .delete('/api/currencies/' + new mongoose.Types.ObjectId)
                .end(function (err, res) {
                    res.status.should.equal(400);
                });
        });
    });

    describe('DELETE', function () {
        it('(normal delete)should return status 204',async function () {
            let currency = await Currency.create({
                value: 'uk'
            });
            chai.request('localhost:3000')
                .delete('/api/currencies/' + currency._id)
                .end(function (err, res) {
                    res.status.should.equal(204);
                });
        });
        it('(wrong id)should return status 400',async function () {
            chai.request('localhost:3000')
                .delete('/api/currencies/' + 'invalidId')
                .end(function (err, res) {
                    res.status.should.equal(400);
                });
        });
    });
});