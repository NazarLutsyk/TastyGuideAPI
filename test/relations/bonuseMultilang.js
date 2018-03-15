require('../../config/path');
let BonuseMultilang = require('../../models/BonuseMultilang');
let Bonuse = require('../../models/Bonuse');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('bonuse Multilang relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idBonuse = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let bonuse = await Bonuse.create({
                    _id: idBonuse,
                    startDate: new Date(),
                    endDate: new Date(),
                });
            });
            afterEach(async function () {
                await BonuseMultilang.remove();
                await Bonuse.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/bonuseMultilangs')
                    .send({
                        header : 'asdasd',
                        description : 'asda',
                        conditions : 'asda',
                        bonuse: idBonuse
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.bonuse.should.equal(idBonuse.toString());
                let bonuse = await Bonuse.findById(idBonuse);
                bonuse.multilang.should.include(res.body._id.toString());
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/bonuseMultilangs')
                        .send({
                            header : 'asdasd',
                            description : 'asda',
                            conditions : 'asda',
                            bonuse: new mongoose.Types.ObjectId,
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('update', function () {
            let idBonuse = new mongoose.Types.ObjectId;
            let idMultilang = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let bonuse = await Bonuse.create({
                    _id: idBonuse,
                    startDate: new Date(),
                    endDate: new Date(),
                });
                let multilang = await BonuseMultilang.create({
                    _id: idMultilang,
                    header : 'asdasd',
                    description : 'asda',
                    conditions : 'asda',
                });
            });
            afterEach(async function () {
                await BonuseMultilang.remove();
                await Bonuse.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/bonuseMultilangs/' + idMultilang)
                    .send({
                        bonuse: idBonuse
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.bonuse.should.equal(idBonuse.toString());
                let bonuse = await Bonuse.findById(idBonuse);
                bonuse.multilang.should.include(res.body._id.toString());
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var multilang = await BonuseMultilang.create({
                        header : 'asdasd',
                        description : 'asda',
                        conditions : 'asda',
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/bonuseMultilangs/' + multilang._id)
                        .send({
                            bonuse: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    multilang = await BonuseMultilang.findById(multilang._id);
                    should.equal(multilang.bonuse,undefined);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var multilang = new BonuseMultilang({
                        header : 'asdasd',
                        description : 'asda',
                        conditions : 'asda',
                        bonuse : idBonuse
                    });
                    multilang = await multilang.supersave();

                    let res = await chai.request('localhost:3000')
                        .put('/api/bonuseMultilangs/' + multilang._id)
                        .send({
                            bonuse: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    multilang = await BonuseMultilang.findById(multilang._id);
                    let bonuse = await Bonuse.findById(idBonuse);
                    multilang.bonuse.should.eql(bonuse._id);
                    bonuse.multilang.should.include(multilang._id);
                }
            });
        });

        describe('delete', function () {
            let idBonuse = new mongoose.Types.ObjectId;

            before(async function () {
                let bonuse = await Bonuse.create({
                    _id: idBonuse,
                    startDate: new Date(),
                    endDate: new Date(),
                });
            });
            after(async function () {
                await BonuseMultilang.remove();
                await Bonuse.remove();
            });
            it('normal delete model with relations', async function () {
                let multilang = new BonuseMultilang({
                    header : 'asdasd',
                    description : 'asda',
                    conditions : 'asda',
                    bonuse : idBonuse
                });
                multilang = await multilang.supersave();
                let res = await chai.request('localhost:3000')
                    .delete('/api/bonuseMultilangs/' + multilang._id);
                res.status.should.equal(204);
                let bonuse = await Bonuse.findById(idBonuse);
                should.equal(bonuse.multilang.length,0)
            });
        });
    });
});