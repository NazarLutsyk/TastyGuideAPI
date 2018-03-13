require('../../config/path');
let Client = require('../../models/Client');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('API endpoint /api/clients', function () {
    this.timeout(5000);
    mongoose.connect('mongodb://localhost/drinker');

    describe('GET', function () {
        let id1 = new mongoose.Types.ObjectId;
        let id2 = new mongoose.Types.ObjectId;
        before(async function () {
            await Client.create({
                _id: id1,
                name: 'b',
                surname : 'b'
            });
            await Client.create({
                _id: id2,
                name: 'a',
                surname: 'a'
            });
        });
        after(async function () {
            await Client.remove({});
        });

        it('(normal get)should return list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/clients');
            res.status.should.equal(200);
            res.body.should.be.a('array');
            res.body.length.should.be.above(0);
        });
        it('(normal get)should return model by id', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/clients/' + id1);
            res.status.should.equal(200);
            res.body.should.have.property('_id');
        });
        it('(wrong id)should return null', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/clients/' + new mongoose.Types.ObjectId);
            res.status.should.equal(200);
            should.not.exist(res.body);
        });
        it('(normal get with select) should return list of models with selected fields', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/clients')
                .query({fields: 'name,-_id'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].should.have.property('name').but.not.have.property('_id');
        });
        it('(normal get with sorting) should return sorted list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/clients')
                .query({sort: 'name'});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body[0].name.should.equal('a');
        });
        it('(normal get with query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/clients')
                .query({query: JSON.stringify({name: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(1);
            res.body[0].name.should.equal('a');
        });
        it('(wrong query) should return queried list of models', async function () {
            let res = await chai.request('localhost:3000')
                .get('/api/clients')
                .query({query: JSON.stringify({wrongField: 'a'})});
            res.status.should.equal(200);
            res.body.should.be.an('array');
            res.body.should.have.lengthOf(0);
        });
    });

    describe('PUT', function () {
        let id = new mongoose.Types.ObjectId;
        before(async function () {
            await Client.create({
                _id: id,
                name: 'b',
                surname : 'b'
            });
        });
        after(async function () {
            await Client.remove({});
        });
        it('(normal update)should update model', async function () {
            let res = await chai.request('localhost:3000')
                .put('/api/clients/' + id)
                .send({
                    name: 'a',
                    surname: 'a'
                });
            res.status.should.equal(201);
            res.body.should.be.a('object');
            res.body.name.should.equal('a');
            res.body.surname.should.equal('a');
        });
        it('(unknown field)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/clients/' + id)
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
                    .put('/api/clients/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
        it('(invalid phone and email)should return status 400', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .put('/api/clients/' + id)
                    .send({
                        phone : 'asd',
                        email : 'sww'
                    });
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 400);
            }
        });
    });

    describe('DELETE', function () {
        after(async function () {
            await Client.remove({});
        });
        it('(normal delete)should return status 204', async function () {
            let lang = await Client.create({
                name: 'uk',
                surname : 'aaa'
            });
            let res = await chai.request('localhost:3000')
                .delete('/api/clients/' + lang._id);
            res.status.should.equal(204);
        });
        it('(wrong id)should return status 404', async function () {
            try {
                let res = await chai.request('localhost:3000')
                    .delete('/api/clients/' + new mongoose.Types.ObjectId);
                if (res.status) should.fail();
            } catch (e) {
                should.equal(e.status, 404);
            }
        });
    });
});