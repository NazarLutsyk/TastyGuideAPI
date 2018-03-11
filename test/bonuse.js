require('../config/path');
let Bonuse = require('../models/Bonuse');
let Lang = require('../models/Lang');
let BonuseMultilang = require('../models/BonuseMultilang');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('API endpoint /api/bonuses', function () {
    this.timeout(5000);
    mongoose.connect('mongodb://localhost/drinker');
    describe('GET', function () {
        let id1 = new mongoose.Types.ObjectId;
        before(function (done) {
            Lang.create({
                name: 'eng'
            }, function (err, lang) {
                Bonuse.create({
                    _id: id1,
                    startDate: 'Fri Mar 09 2018 18:49:59',
                    endDate: 'Fri Mar 09 2018 18:50:00',
                }, function (err, bonuse) {
                    BonuseMultilang.create({
                        header: 'header',
                        description: 'description',
                        conditions: 'conditions',
                        lang: lang._id,
                        bonuse: bonuse
                    }, function (err, multilang) {
                        Bonuse.create({
                            startDate: 'Fri Mar 09 2018 19:49:59',
                            endDate: 'Fri Mar 09 2018 20:50:00'
                        }, function (err, aaa) {
                            done();
                        })
                    });

                })
            });
        });

        after(function (done) {
            Bonuse.remove({}, function () {
                BonuseMultilang.remove({}, function () {
                    Lang.remove({}, function () {
                        done();
                    })
                })
            });
        });
        it('(normal get)should return list of models', function (done) {
            chai.request('localhost:3000')
                .get('/api/bonuses')
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.above(0);
                    done();
                });
        });
        it('(normal get)should return model by id', function (done) {
            chai.request('localhost:3000')
                .get('/api/bonuses/' + id1)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.have.property('_id');
                    done();
                });
        });
        it('(wrong id)should return null', function (done) {
            chai.request('localhost:3000')
                .get('/api/bonuses/' + new mongoose.Types.ObjectId)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    should.not.exist(res.body);
                    done();
                });
        });
        it('(normal get with select) should return list of models with selected fields', function (done) {
            chai.request('localhost:3000')
                .get('/api/bonuses')
                .query({fields: 'startDate,-_id'})
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    res.body[0].should.have.property('startDate').but.not.have.property('_id');
                    done();
                })
        });
        it('(normal get with sorting) should return sorted list of models', function (done) {
            chai.request('localhost:3000')
                .get('/api/bonuses')
                .query({sort: 'startDate'})
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    res.body[0].startDate.should.equal('2018-03-09T16:49:59.000Z');
                    done();
                });
        });
        it('(normal get with query) should return queried list of models', function (done) {
            chai.request('localhost:3000')
                .get('/api/bonuses')
                .query({query: JSON.stringify({startDate: 'Fri Mar 09 2018 18:49:59'})})
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    res.body.should.have.lengthOf(1);
                    res.body[0].startDate.should.equal('2018-03-09T16:49:59.000Z');
                    done();
                });
        });
        it('(wrong query) should return queried list of models', function (done) {
            chai.request('localhost:3000')
                .get('/api/bonuses')
                .query({query: JSON.stringify({wrongField: 'a'})})
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.be.an('array');
                    res.body.should.have.lengthOf(0);
                    done();
                });
        });
        it('(normal get with population) should return populated model', function (done) {
            chai.request('localhost:3000')
                .get('/api/bonuses/' + id1)
                .query({populate: 'multilang'})
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.should.have.nested.property('multilang[0].header');
                    done();
                });
        });
    });

    describe('POST', function () {
        it('(normal create)should return created model', function (done) {
            chai.request('localhost:3000')
                .post('/api/bonuses')
                .send({
                    startDate: 'Fri Mar 09 2019 11:49:59',
                    endDate: 'Fri Mar 09 2020 18:50:00'
                })
                .end(function (err, res) {
                    res.status.should.equal(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('startDate');
                    res.body.should.have.property('startDate');
                    done();
                });
        });
        it('(unknown field)should return status 400', function (done) {
            chai.request('localhost:3000')
                .post('/api/bonuses/')
                .send({
                    unknownField: 'aaaa'
                })
                .end(function (err, res) {
                    res.status.should.equal(400);
                    done();
                });
        });
        it('(missing required)should return status 400', function (done) {
            chai.request('localhost:3000')
                .post('/api/bonuses/')
                .end(function (err, res) {
                    res.status.should.equal(400);
                    done();
                });
        });
        it('(start date gt than end date)should return status 400', function (done) {
            chai.request('localhost:3000')
                .post('/api/bonuses/')
                .send({
                    startDate: '2018-03-09T16:49:59.000Z',
                    endDate: '2018-03-08T16:49:59.000Z'
                })
                .end(function (err, res) {
                    res.status.should.equal(400);
                    done();
                });
        });
    });

    describe('PUT', function () {
        let id = new mongoose.Types.ObjectId;
        before(function (done) {
            Bonuse.create({
                _id: id,
                startDate: 'Fri Mar 09 2018 18:49:59',
                endDate: 'Fri Mar 09 2018 18:50:00'
            }, function () {
                done();
            });
        });
        // after(async function () {
        //     await Bonuse.remove({});
        //     await BonuseMultilang.remove({});
        //     await Lang.remove({});
        // });
        it('(normal update)should update model', function (done) {
            chai.request('localhost:3000')
                .put('/api/bonuses/' + id)
                .send({
                    startDate: 'Fri Mar 09 2030 18:50:00'
                })
                .end(function (err, res) {
                    res.status.should.equal(201);
                    res.body.should.be.a('object');
                    res.body.startDate.should.equal('2030-03-09T16:50:00.000Z');
                    done();
                });
        });
        it('(unknown field)should return status 400', function (done) {
            chai.request('localhost:3000')
                .put('/api/bonuses/' + id)
                .send({
                    unknownField: 'aaaa'
                })
                .end(function (err, res) {
                    res.status.should.equal(400);
                    done();
                });
        });
        it('(invalid id)should return status 400', function (done) {
            chai.request('localhost:3000')
                .delete('/api/bonuses/' + new mongoose.Types.ObjectId)
                .end(function (err, res) {
                    res.status.should.equal(400);
                    done();
                });
        });
        it('(normal save with multilang)should add relation to multilang', async function () {
            let lang = await Lang.create({
                name: 'eng'
            });
            let multilang = await BonuseMultilang.create({
                header: 'header',
                description: 'description',
                conditions: 'conditions',
                lang: lang._id,
            });
            let bonuse = await Bonuse.create({
                startDate: 'Fri Mar 09 2018 18:49:59',
                endDate: 'Fri Mar 09 2018 18:50:00',
            });

            chai.request('localhost:3000')
                .put(`/api/bonuses/${bonuse._id}/multilangs/${multilang._id}`)
                .end(async function (err, res) {
                    res.status.should.equal(201);
                    multilang = await BonuseMultilang.findById(multilang._id);
                    bonuse = await Bonuse.findById(bonuse._id);
                    multilang.should.have.nested.property('bonuse');
                    multilang.bonuse.should.equal(bonuse._id);
                    bonuse.should.have.nested.property('multilang');
                    bonuse.should.have.nested.property('multilang',[multilang._id]);
                });
        });
    });
});

describe('DELETE', function () {
    let id = new mongoose.Types.ObjectId;
    beforeEach(function (done) {
        Bonuse.create({
            _id: id,
            startDate: 'Fri Mar 09 2019 17:49:59',
            endDate: 'Fri Mar 09 2020 20:50:00'
        }, function () {
            done();
        });
    });
    afterEach(function (done) {
        Bonuse.findByIdAndRemove(id, function () {
            done();
        });
    });

    it('(normal delete)should return status 204', function (done) {
        chai.request('localhost:3000')
            .delete('/api/bonuses/' + id)
            .end(function (err, res) {
                res.status.should.equal(204);
                done();
            });
    });
    it('(wrong id)should return status 400', function (done) {
        chai.request('localhost:3000')
            .delete('/api/bonuses/' + 'invalidId')
            .end(function (err, res) {
                res.status.should.equal(400);
                done();
            });
    });
});