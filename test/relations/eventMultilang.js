require('../../config/path');
let EventMultilang = require('../../models/EventMultilang');
let Event = require('../../models/Event');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('event multilang relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idEvent = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let event = await Event.create({
                    _id: idEvent,
                });
            });
            afterEach(async function () {
                await EventMultilang.remove();
                await Event.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/eventMultilangs')
                    .send({
                        header : 'asdasd',
                        description : 'asda',
                        event: idEvent
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.event.should.equal(idEvent.toString());
                let event = await Event.findById(idEvent);
                event.multilang.should.include(res.body._id.toString());
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/eventMultilangs')
                        .send({
                            header : 'asdasd',
                            description : 'asda',
                            event: new mongoose.Types.ObjectId,
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('update', function () {
            let idEvent = new mongoose.Types.ObjectId;
            let idMultilang = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let event = await Event.create({
                    _id: idEvent,
                });
                let multilang = await EventMultilang.create({
                    _id: idMultilang,
                    header : 'asdasd',
                    description : 'asda',
                });
            });
            afterEach(async function () {
                await EventMultilang.remove();
                await Event.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/eventMultilangs/' + idMultilang)
                    .send({
                        event: idEvent
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.event.should.equal(idEvent.toString());
                let event = await Event.findById(idEvent);
                event.multilang.should.include(res.body._id.toString());
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var multilang = await EventMultilang.create({
                        header : 'asdasd',
                        description : 'asda',
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/eventMultilangs/' + multilang._id)
                        .send({
                            event: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    multilang = await EventMultilang.findById(multilang._id);
                    should.equal(multilang.event,undefined);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var multilang = new EventMultilang({
                        header : 'asdasd',
                        description : 'asda',
                        event : idEvent
                    });
                    multilang = await multilang.supersave();

                    let res = await chai.request('localhost:3000')
                        .put('/api/eventMultilangs/' + multilang._id)
                        .send({
                            event: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    multilang = await EventMultilang.findById(multilang._id);
                    let event = await Event.findById(idEvent);
                    multilang.event.should.eql(event._id);
                    event.multilang.should.include(multilang._id);
                }
            });
        });

        describe('delete', function () {
            let idEvent = new mongoose.Types.ObjectId;

            before(async function () {
                let event = await Event.create({
                    _id: idEvent,
                });
            });
            after(async function () {
                await EventMultilang.remove();
                await Event.remove();
            });
            it('normal delete model with relations', async function () {
                let multilang = new EventMultilang({
                    header : 'asdasd',
                    description : 'asda',
                    event : idEvent
                });
                multilang = await multilang.supersave();
                let res = await chai.request('localhost:3000')
                    .delete('/api/eventMultilangs/' + multilang._id);
                res.status.should.equal(204);
                let event = await Event.findById(idEvent);
                should.equal(event.multilang.length,0)
            });
        });
    });
});