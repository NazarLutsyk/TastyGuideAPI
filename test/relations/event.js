require('../../config/path');
let Event = require('../../models/Event');
let Multilang = require('../../models/EventMultilang');
let Place = require('../../models/Place');
let Image = require('../../models/Image');
let Department = require('../../models/Department');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('event relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idPlace = new mongoose.Types.ObjectId;
            let idMultilang1 = new mongoose.Types.ObjectId;
            let idMultilang2 = new mongoose.Types.ObjectId;
            let idImage = new mongoose.Types.ObjectId;
            let idDepartment = new mongoose.Types.ObjectId;
            beforeEach(async function () {
                await Place.create({
                    _id: idPlace,
                    phone: '35545754222',
                    email: 'asdas2asd@asdd.sad'
                });
                await Multilang.create({
                    _id: idMultilang1,
                    header: 'asdasd',
                    description: 'sdsd'
                });
                await Multilang.create({
                    _id: idMultilang2,
                    header: 'asdasd',
                    description: 'sdsd'
                });
                await Image.create({
                    _id: idImage,
                });
                await Department.create({
                    _id: idDepartment,
                });
            });
            afterEach(async function () {
                await Event.remove({});
                await Multilang.remove({});
                await Place.remove({});
                await Image.remove({});
                await Department.remove({});
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/events')
                    .send({
                        author: idDepartment,
                        place: idPlace,
                        image: idImage,
                        multilang: [idMultilang1, idMultilang2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.author.should.equal(idDepartment.toString());
                res.body.place.should.equal(idPlace.toString());
                res.body.image.should.equal(idImage.toString());
                res.body.multilang.should.lengthOf(2);
                res.body.multilang.should.include(idMultilang1.toString());
                res.body.multilang.should.include(idMultilang2.toString());

                let oldDepartment = await Department.findById(idDepartment);
                let oldPlace = await Place.findById(idPlace);
                let oldImage = await Image.findById(idImage);
                let oldMultilang1 = await Multilang.findById(idMultilang1);
                let oldMultilang2 = await Multilang.findById(idMultilang2);

                oldDepartment.promos.should.lengthOf(1);
                oldDepartment.promos.should.include(res.body._id.toString());
                oldPlace.promos.should.lengthOf(1);
                oldPlace.promos.should.include(res.body._id.toString());
                oldMultilang1.event.toString().should.equal(res.body._id.toString());
                oldMultilang2.event.toString().should.equal(res.body._id.toString());
            });

            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/events')
                        .send({
                            author: new mongoose.Types.ObjectId,
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }

            });
        });

        describe('update', function () {
            let idPlace = new mongoose.Types.ObjectId;
            let idMultilang1 = new mongoose.Types.ObjectId;
            let idMultilang2 = new mongoose.Types.ObjectId;
            let idImage = new mongoose.Types.ObjectId;
            let idDepartment = new mongoose.Types.ObjectId;
            let idEvent = new mongoose.Types.ObjectId;
            beforeEach(async function () {
                await Place.create({
                    _id: idPlace,
                    phone: '35545754222',
                    email: 'asdas2asd@asdd.sad'
                });
                await Multilang.create({
                    _id: idMultilang1,
                    header: 'asdasd',
                    description: 'sdsd'
                });
                await Multilang.create({
                    _id: idMultilang2,
                    header: 'asdasd',
                    description: 'sdsd'
                });
                await Image.create({
                    _id: idImage,
                });
                await Department.create({
                    _id: idDepartment,
                });
                await Event.create({
                    _id: idEvent,
                });
            });
            afterEach(async function () {
                await Event.remove({});
                await Multilang.remove({});
                await Place.remove({});
                await Image.remove({});
                await Department.remove({});
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/events/' + idEvent)
                    .send({
                        author: idDepartment,
                        place: idPlace,
                        image: idImage,
                        multilang: [idMultilang1, idMultilang2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');

                let oldDepartment = await Department.findById(idDepartment);
                let oldPlace = await Place.findById(idPlace);
                let oldImage = await Image.findById(idImage);
                let oldMultilang1 = await Multilang.findById(idMultilang1);
                let oldMultilang2 = await Multilang.findById(idMultilang2);

                res.body.author.should.equal(oldDepartment._id.toString());
                res.body.place.should.equal(oldPlace._id.toString());
                res.body.image.should.equal(oldImage._id.toString());
                res.body.multilang.should.lengthOf(2);
                res.body.multilang.should.include(oldMultilang1._id.toString());
                res.body.multilang.should.include(oldMultilang2._id.toString());

                oldDepartment.promos.should.lengthOf(1);
                oldDepartment.promos.should.include(res.body._id.toString());
                oldPlace.promos.should.lengthOf(1);
                oldPlace.promos.should.include(res.body._id.toString());
                oldMultilang1.event.toString().should.equal(res.body._id.toString());
                oldMultilang2.event.toString().should.equal(res.body._id.toString());
            });
            it('should delete old relation and add new', async function () {
                let newPlace = await Place.create({
                    phone: '35545754222',
                    email: 'asdas2asd@asdd.sad'
                });
                let newMultilang1 = await Multilang.create({
                    header: 'asdasd',
                    description: 'sdsd'
                });
                let newImage = await Image.create({});
                let newDepartment = await Department.create({});
                let event = new Event({
                    author: idDepartment,
                    place: idPlace,
                    image: idImage,
                    multilang: [idMultilang1, idMultilang2]
                });
                event = await event.supersave();

                let res = await chai.request('localhost:3000')
                    .put('/api/events/' + event._id)
                    .send({
                        author: newDepartment._id,
                        place: newPlace._id,
                        image: newImage._id,
                        multilang: [newMultilang1._id]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');

                let oldDepartment = await Department.findById(idDepartment);
                let oldPlace = await Place.findById(idPlace);
                let oldMultilang1 = await Multilang.findById(idMultilang1);
                let oldMultilang2 = await Multilang.findById(idMultilang2);

                newDepartment = await Department.findById(newDepartment._id);
                newPlace = await Place.findById(newPlace._id);
                newMultilang1 = await Multilang.findById(newMultilang1._id);

                res.body.author.should.equal(newDepartment._id.toString());
                res.body.place.should.equal(newPlace._id.toString());
                res.body.image.should.equal(newImage._id.toString());
                res.body.multilang.should.lengthOf(1);
                res.body.multilang.should.include(newMultilang1._id.toString());

                newDepartment.promos.should.lengthOf(1);
                newDepartment.promos.should.include(res.body._id.toString());
                newPlace.promos.should.lengthOf(1);
                newPlace.promos.should.include(res.body._id.toString());
                newMultilang1.event.toString().should.equal(res.body._id.toString());

                should.equal(oldDepartment.promos.length, 0);
                should.equal(oldPlace.promos.length, 0);
                should.equal(oldMultilang1.event, null);
                should.equal(oldMultilang2.event, null);
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .put('/api/events/' + idEvent)
                        .send({
                            author: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId,
                            image: new mongoose.Types.ObjectId,
                            multilang: [new mongoose.Types.ObjectId]
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    let event = await Event.findById(idEvent);
                    should.equal(e.status, 400);
                    should.equal(event.author, undefined);
                    should.equal(event.image, undefined);
                    should.equal(event.place, undefined);
                    should.equal(event.multilang.length, 0);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var event = new Event({
                        author: idDepartment,
                        place: idPlace,
                        image: idImage,
                        multilang: [idMultilang1, idMultilang2]
                    });
                    event = await event.supersave();
                    let res = await chai.request('localhost:3000')
                        .put('/api/events/' + idEvent)
                        .send({
                            author: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId,
                            image: new mongoose.Types.ObjectId,
                            multilang: [new mongoose.Types.ObjectId]
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    event = await Event.findById(event._id);
                    event.author.toString().should.equal(idDepartment.toString());
                    event.place.toString().should.equal(idPlace.toString());
                    event.image.toString().should.equal(idImage.toString());
                    event.multilang.should.lengthOf(2);
                    event.multilang.should.include(idMultilang1.toString());
                    event.multilang.should.include(idMultilang2.toString());

                    let oldDepartment = await Department.findById(idDepartment);
                    let oldPlace = await Place.findById(idPlace);
                    let oldMultilang1 = await Multilang.findById(idMultilang1);
                    let oldMultilang2 = await Multilang.findById(idMultilang2);

                    oldDepartment.promos.should.lengthOf(1);
                    oldDepartment.promos.should.include(event._id.toString());
                    oldPlace.promos.should.lengthOf(1);
                    oldPlace.promos.should.include(event._id.toString());
                    oldMultilang1.event.toString().should.equal(event._id.toString());
                    oldMultilang2.event.toString().should.equal(event._id.toString());
                }
            });
        });

        describe('delete', function () {
            let idPlace = new mongoose.Types.ObjectId;
            let idMultilang1 = new mongoose.Types.ObjectId;
            let idMultilang2 = new mongoose.Types.ObjectId;
            let idImage = new mongoose.Types.ObjectId;
            let idDepartment = new mongoose.Types.ObjectId;
            beforeEach(async function () {
                await Place.create({
                    _id: idPlace,
                    phone: '35545754222',
                    email: 'asdas2asd@asdd.sad'
                });
                await Multilang.create({
                    _id: idMultilang1,
                    header: 'asdasd',
                    description: 'sdsd'
                });
                await Multilang.create({
                    _id: idMultilang2,
                    header: 'asdasd',
                    description: 'sdsd'
                });
                await Image.create({
                    _id: idImage,
                });
                await Department.create({
                    _id: idDepartment,
                });
            });
            afterEach(async function () {
                await Event.remove({});
                await Multilang.remove({});
                await Place.remove({});
                await Image.remove({});
                await Department.remove({});
            });
            it('normal delete model with relations', async function () {
                let event = new Event({
                    author: idDepartment,
                    place: idPlace,
                    image: idImage,
                    multilang: [idMultilang1, idMultilang2]
                });
                event = await event.supersave();
                let res = await chai.request('localhost:3000')
                    .delete('/api/events/' + event._id);

                res.status.should.equal(204);

                let oldDepartment = await Department.findById(idDepartment);
                let oldPlace = await Place.findById(idPlace);
                let oldMultilang1 = await Multilang.findById(idMultilang1);
                let oldMultilang2 = await Multilang.findById(idMultilang2);

                should.equal(oldDepartment.promos.length, 0);
                should.equal(oldPlace.promos.length, 0);
                should.equal(oldMultilang1, null);
                should.equal(oldMultilang2, null);
            });
        });
    });

    describe('push pull', function () {
        let idMultilang = new mongoose.Types.ObjectId;
        beforeEach(async function () {
            await Multilang.create({
                _id: idMultilang,
                header: 'aas',
                description: 'aas',
            });
        });
        afterEach(async function () {
            await Multilang.remove({});
            await Event.remove({});
        });
        describe('PUT', function () {
            it('should add relation to empty model', async function () {
                let event = await Event.create({});
                let res = await chai.request('localhost:3000')
                    .put(`/api/events/${event._id}/multilangs/${idMultilang}`);
                let multilang = await Multilang.findById(idMultilang);
                event = await Event.findById(event._id);
                res.status.should.equal(201);
                multilang.event.toString().should.equal(event._id.toString());
                event.multilang.should.include(multilang._id.toString());
            });
            it('should add relation to not empty model', async function () {
                let multilang1 = await Multilang.create({
                    header: 'aas',
                    description: 'aas',
                });
                let event = new Event({multilang: [multilang1._id]});
                event = await event.supersave();
                let res = await chai.request('localhost:3000')
                    .put(`/api/events/${event._id}/multilangs/${idMultilang}`);
                multilang1 = await Multilang.findById(multilang1._id);
                let multilang2 = await Multilang.findById(idMultilang);
                event = await Event.findById(event._id);
                res.status.should.equal(201);
                multilang1.event.toString().should.equal(event._id.toString());
                multilang2.event.toString().should.equal(event._id.toString());
                event.multilang.should.include(multilang1._id.toString());
                event.multilang.should.include(multilang2._id.toString());
                event.multilang.should.lengthOf(2);
            });
            it('should not add duplicated relation', async function () {
                let event = new Event({multilang: [idMultilang]});
                event = await event.supersave();
                let res = await chai.request('localhost:3000')
                    .put(`/api/events/${event._id}/multilangs/${idMultilang}`);
                let multilang = await Multilang.findById(idMultilang);
                event = await Event.findById(event._id);
                res.status.should.equal(201);
                multilang.event.toString().should.equal(event._id.toString());
                event.multilang.should.include(multilang._id.toString());
                event.multilang.should.lengthOf(1);
            });
            it('should not add wrong relation', async function () {
                try {
                    var event = await Event.create({});
                    let res = await chai.request('localhost:3000')
                        .put(`/api/events/${event._id}/multilangs/${new mongoose.Types.ObjectId}`);
                    if (res.status) should.fail();
                } catch (e) {
                    event = await Event.findById(event._id);
                    e.status.should.equal(400);
                    should.equal(event.multilang.length, 0);
                }
            });
        });
        describe('DELETE', function () {
            let idMultilang = new mongoose.Types.ObjectId;
            let idEvent = new mongoose.Types.ObjectId;
            beforeEach(async function () {
                let multilang = await Multilang.create({
                    _id: idMultilang,
                    header: 'aas',
                    description: 'aas',
                });
                let event = await Event({
                    _id: idEvent,
                    multilang: [multilang]
                });
                event = await event.supersave();
            });
            afterEach(async function () {
                await Multilang.remove({});
                await Event.remove({});
            });
            it('should delete relation', async function () {
                let res = await chai.request('localhost:3000')
                    .delete(`/api/events/${idEvent}/multilangs/${idMultilang}`);
                let multilang = await Multilang.findById(idMultilang);
                let event = await Event.findById(idEvent);
                res.status.should.equal(204);
                should.equal(multilang.event, null);
                should.equal(event.multilang.length, 0);
            });
            it('should not remove wrong relation', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .delete(`/api/events/${idEvent}/multilangs/${new mongoose.Types.ObjectId}`);
                } catch (e) {
                    let multilang = await Multilang.findById(idMultilang);
                    let event = await Event.findById(idEvent);
                    e.status.should.equal(400);
                    should.equal(event.multilang.length, 1);
                    should.equal(multilang.event.toString(), event._id.toString());
                }
            });
        });
    });
})
;