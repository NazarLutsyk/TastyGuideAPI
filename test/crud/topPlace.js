require('../../config/path');
let TopPlace = require('../../models/TopPlace');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('API endpoint /api/topPlaces', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('GET', function (desc) {
        let id1 = new mongoose.Types.ObjectId;
        let id2 = new mongoose.Types.ObjectId;
        before(async function () {
            await TopPlace.create({
                _id: id1,
                startDate: new Date(),
                endDate: new Date('Mon Mar 15 2019 12:54:05'),
                price: 3000,
            });
            await TopPlace.create({
                _id: id2,
                startDate: new Date(),
                endDate: new Date('Mon Mar 15 2019 12:54:05'),
                price: 5000,
            });
        });
        after(async function () {
            await TopPlace.remove({});
        });

        it('(normal get)should return list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/topPlaces');
            res.status.should.equal(200);
            res.body.should.be.a('array');
            res.body.length.should.be.above(0);
        });
        it('(normal get)should return model by id', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/topPlaces/' + id1);
            res.status.should.equal(200);
            res.body.should.have.property('_id');
        });
        it('(wrong id)should return null', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/topPlaces/' + new mongoose.Types.ObjectId);
            res.status.should.equal(200);
            should.not.exist(res.body);
        });
        it('(normal get with select) should return list of models with selected fields', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/topPlaces')
                .query({fields: 'actual,-_id'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].should.have.property('actual').but.not.have.property('_id');
        });
        it('(normal get with sorting) should return sorted list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/topPlaces')
                .query({sort: 'price'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].price.should.equal(3000);
        });
        it('(normal get with query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/topPlaces')
                .query({query: JSON.stringify({price: 5000})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(1);
            res.body[0].price.should.equal(5000);
        });
        it('(wrong query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/topPlaces')
                .query({query: JSON.stringify({wrongField: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(0);
        });
    });

    describe('POST', function () {
        after(async function () {
            await TopPlace.remove({});
        });

        it('(normal create with non existing place)should return created model', async function () {
            let res = await chai.request('localhost:3000')
                .post('/api/topPlaces')
                .send({
                    startDate: new Date(),
                    endDate: new Date('Mon Mar 15 2019 12:54:05'),
                    price: 5000,
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.price.should.equal(5000);
            res.body.actual.should.equal(true);
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .post('/api/topPlaces/')
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
                    .post('/api/topPlaces/');
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
    });

    describe('PUT', function () {
        let id = new mongoose.Types.ObjectId;
        before(async function () {
            await TopPlace.create({
                _id: id,
                startDate: new Date(),
                endDate: new Date('Mon Mar 15 2019 12:54:05'),
                price: 5000,
            });
        });
        after(async function () {
            await TopPlace.remove({});
        });

        it('(normal update)should update model', async function () {
            let res = await chai.request('localhost:3000')
                .put('/api/topPlaces/' + id)
                .send({
                    price: 0
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.price.should.equal(0);
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/topPlaces/' + id)
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
                    .put('/api/topPlaces/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });

    describe('DELETE', function () {
        it('(normal delete)should return status 204', async function () {
            let topPlace = await TopPlace.create({
                startDate: new Date(),
                endDate: new Date('Mon Mar 15 2019 12:54:05'),
                price: 5000,
            });
            let res = await chai.request('localhost:3000')
                .delete('/api/topPlaces/' + topPlace._id);
            res.status.should.equal(204);
        });
        it('(wrong id)should return status 404', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .delete('/api/topPlaces/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });
});