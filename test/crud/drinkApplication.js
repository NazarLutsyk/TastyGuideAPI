require('../../config/path');
let DrinkApplication = require('../../models/DrinkApplication');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('API endpoint /api/drinkApplications', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('GET', function (desc) {
        let id1 = new mongoose.Types.ObjectId;
        let id2 = new mongoose.Types.ObjectId;
        before(async function () {
            await DrinkApplication.create({
                _id: id1,
                budged: 700,
                date : new Date()
            });
            await DrinkApplication.create({
                _id: id2,
                budged: 500,
                date : new Date()
            });
        });
        after(async function () {
            await DrinkApplication.remove({});
        });

        it('(normal get)should return list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/drinkApplications');
            res.status.should.equal(200);
            res.body.should.be.a('array');
            res.body.length.should.be.above(0);
        });
        it('(normal get)should return model by id', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/drinkApplications/' + id1);
            res.status.should.equal(200);
            res.body.should.have.property('_id');
        });
        it('(wrong id)should return null', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/drinkApplications/' + new mongoose.Types.ObjectId);
            res.status.should.equal(200);
            should.not.exist(res.body);
        });
        it('(normal get with select) should return list of models with selected fields', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/drinkApplications')
                .query({fields: 'budged,-_id'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].should.have.property('budged').but.not.have.property('_id');
        });
        it('(normal get with sorting) should return sorted list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/drinkApplications')
                .query({sort: 'budged'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].budged.should.equal(500);
        });
        it('(normal get with query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/drinkApplications')
                .query({query: JSON.stringify({budged: 500})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(1);
            res.body[0].budged.should.equal(500);
        });
        it('(wrong query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/drinkApplications')
                .query({query: JSON.stringify({wrongField: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(0);
        });
    });

    describe('POST', function () {
        after(async function () {
            await DrinkApplication.remove({});
        });

        it('(normal create)should return created model', async function () {
            let res = await chai.request('localhost:3000')
                .post('/api/drinkApplications')
                .send({
                    friends : 'tasik',
                    goal : 'drink',
                    budged : 500,
                    date : new Date(),
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.friends.should.equal('tasik');
            res.body.goal.should.equal('drink');
            res.body.budged.should.equal(500);
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .post('/api/drinkApplications/')
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
                    .post('/api/drinkApplications/');
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
    });

    describe('PUT', function () {
        let id = new mongoose.Types.ObjectId;
        before(async function () {
            await DrinkApplication.create({
                _id: id,
                friends : 'tasik',
                goal : 'drink',
                budged : 500,
                date : new Date(),
            });
        });
        after(async function () {
            await DrinkApplication.remove({});
        });

        it('(normal update)should update model', async function () {
            let res = await chai.request('localhost:3000')
                .put('/api/drinkApplications/' + id)
                .send({
                    budged: 1000
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.budged.should.equal(1000);
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/drinkApplications/' + id)
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
                    .put('/api/drinkApplications/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
        it('(invalid budged)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/drinkApplications/' + id)
                    .send({
                        budged: -500
                    });
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
    });

    describe('DELETE', function () {
        it('(normal delete)should return status 204', async function () {
            let currency = await DrinkApplication.create({
                budged : 500,
                date : new Date(),
            });
            let res = await chai.request('localhost:3000')
                .delete('/api/drinkApplications/' + currency._id);
            res.status.should.equal(204);
        });
        it('(wrong id)should return status 404', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .delete('/api/drinkApplications/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });
});