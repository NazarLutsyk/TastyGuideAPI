require('../../config/path');
let Day = require('../../models/Day');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('API endpoint /api/days', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('GET', function (desc) {
        let id1 = new mongoose.Types.ObjectId;
        let id2 = new mongoose.Types.ObjectId;
        before(async function () {
            await Day.create({
                _id: id1,
                startTime: new Date(),
                endTime: new Date('Mon Mar 15 2019 12:54:05'),
                place: new mongoose.Types.ObjectId
            });
            await Day.create({
                _id: id2,
                startTime: new Date(),
                endTime: new Date('Mon Mar 15 2019 12:54:05'),
                place: new mongoose.Types.ObjectId
            });
        });
        after(async function () {
            await Day.remove({});
        });

        it('(normal get)should return list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/days');
            res.status.should.equal(200);
            res.body.should.be.a('array');
            res.body.length.should.be.above(0);
        });
        it('(normal get)should return model by id', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/days/' + id1);
            res.status.should.equal(200);
            res.body.should.have.property('_id');
        });
        it('(wrong id)should return null', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/days/' + new mongoose.Types.ObjectId);
            res.status.should.equal(200);
            should.not.exist(res.body);
        });
        it('(normal get with select) should return list of models with selected fields', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/days')
                .query({fields: 'startTime,-_id'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].should.have.property('startTime').but.not.have.property('_id');
        });
        it('(normal get with query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/days')
                .query({query: JSON.stringify({_id: id1})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(1);
            res.body[0]._id.should.equal(id1.toString());
        });
        it('(wrong query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/days')
                .query({query: JSON.stringify({wrongField: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(0);
        });
    });

    describe('POST', function () {
        after(async function () {
            await Day.remove({});
        });

        it('(normal create)should return created model', async function () {
            let res = await chai.request('localhost:3000')
                .post('/api/days')
                .send({
                    startTime: new Date(),
                    endTime: new Date('Mon Mar 15 2019 12:54:05'),
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .post('/api/days/')
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
                    .post('/api/days/');
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
    });

    describe('PUT', function () {
        let id = new mongoose.Types.ObjectId;
        before(async function () {
            await Day.create({
                _id: id,
                startTime: new Date(),
                endTime: new Date('Mon Mar 15 2019 12:54:05'),
                place: new mongoose.Types.ObjectId
            });
        });
        after(async function () {
            await Day.remove({});
        });

        it('(normal update)should update model', async function () {
            let res = await chai.request('localhost:3000')
                .put('/api/days/' + id)
                .send({
                    startTime : new Date()
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/days/' + id)
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
                    .put('/api/days/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });

    describe('DELETE', function () {
        it('(normal delete)should return status 204', async function () {
            let topPlace = await Day.create({
                startTime: new Date(),
                endTime: new Date('Mon Mar 15 2019 12:54:05'),
            });
            let res = await chai.request('localhost:3000')
                .delete('/api/days/' + topPlace._id);
            res.status.should.equal(204);
        });
        it('(wrong id)should return status 404', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .delete('/api/days/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });
});