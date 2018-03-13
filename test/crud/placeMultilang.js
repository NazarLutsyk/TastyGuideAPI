require('../../config/path');
let PlaceMultilang = require('../../models/PlaceMultilang');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('API endpoint /api/placeMultilangs', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('GET', function (desc) {
        let id1 = new mongoose.Types.ObjectId;
        let id2 = new mongoose.Types.ObjectId;
        before(async function () {
            await PlaceMultilang.create({
                _id: id1,
                name : 'b',
                description : 'a'
            });
            await PlaceMultilang.create({
                _id: id2,
                name : 'a',
                description : 'b'
            });
        });
        after(async function () {
            await PlaceMultilang.remove({});
        });

        it('(normal get)should return list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/placeMultilangs');
            res.status.should.equal(200);
            res.body.should.be.a('array');
            res.body.length.should.be.above(0);
        });
        it('(normal get)should return model by id', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/placeMultilangs/' + id1);
            res.status.should.equal(200);
            res.body.should.have.property('_id');
        });
        it('(wrong id)should return null', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/placeMultilangs/' + new mongoose.Types.ObjectId);
            res.status.should.equal(200);
            should.not.exist(res.body);
        });
        it('(normal get with select) should return list of models with selected fields', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/placeMultilangs')
                .query({fields: 'name,-_id'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].should.have.property('name').but.not.have.property('_id');
        });
        it('(normal get with sorting) should return sorted list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/placeMultilangs')
                .query({sort: 'value'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].name.should.equal('b');
        });
        it('(normal get with query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/placeMultilangs')
                .query({query: JSON.stringify({name: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(1);
            res.body[0].name.should.equal('a');
        });
        it('(wrong query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/placeMultilangs')
                .query({query: JSON.stringify({wrongField: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(0);
        });
    });

    describe('POST', function () {
        after(async function () {
            await PlaceMultilang.remove({});
        });

        it('(normal create with non existing place)should return created model', async function () {
            let res = await chai.request('localhost:3000')
                .post('/api/placeMultilangs')
                .send({
                    name : 'a',
                    description : 'b'
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.name.should.equal('a');
            res.body.description.should.equal('b');
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .post('/api/placeMultilangs/')
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
                    .post('/api/placeMultilangs/');
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
    });

    describe('PUT', function () {
        let id = new mongoose.Types.ObjectId;
        before(async function () {
            await PlaceMultilang.create({
                _id: id,
                name : 'a',
                description : 'b'
            });
        });
        after(async function () {
            await PlaceMultilang.remove({});
        });

        it('(normal update)should update model', async function () {
            let res = await chai.request('localhost:3000')
                .put('/api/placeMultilangs/' + id)
                .send({
                    name : 'a',
                    description : 'b'
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.name.should.equal('a');
            res.body.description.should.equal('b');
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/placeMultilangs/' + id)
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
                    .put('/api/placeMultilangs/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });

    describe('DELETE', function () {
        it('(normal delete)should return status 204', async function () {
            let currency = await PlaceMultilang.create({
                name : 'a',
                description : 'b'
            });
            let res = await chai.request('localhost:3000')
                .delete('/api/placeMultilangs/' + currency._id);
            res.status.should.equal(204);
        });
        it('(wrong id)should return status 404', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .delete('/api/placeMultilangs/' +new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });
});