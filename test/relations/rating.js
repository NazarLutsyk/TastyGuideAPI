require('../../config/path');
let Rating = require('../../models/Rating');
let Client = require('../../models/Client');
let Place = require('../../models/Place');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('rating relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idClient = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let client = await Client.create({
                    _id: idClient,
                    name: 'Tasik',
                    surname: 'Parasik'
                });
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
            });
            afterEach(async function () {
                await Rating.remove();
                await Client.remove();
                await Place.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/ratings')
                    .send({
                        client: idClient,
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.client.should.equal(idClient.toString());
                res.body.place.should.equal(idPlace.toString());
                let client = await Client.findById(idClient);
                let place = await Place.findById(idPlace);
                client.ratings.should.lengthOf(1);
                place.ratings.should.lengthOf(1);
                client.ratings.should.include(res.body._id);
                place.ratings.should.include(res.body._id);
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/ratings')
                        .send({
                            client: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('update', function () {
            let idClient = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;
            let idComplaint = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let client = await Client.create({
                    _id: idClient,
                    name: 'Tasik',
                    surname: 'Parasik'
                });
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
                let complaint = await Rating.create({
                    _id: idComplaint,
                });
            });
            afterEach(async function () {
                await Rating.remove();
                await Client.remove();
                await Place.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/ratings/' + idComplaint)
                    .send({
                        client: idClient,
                        place: idPlace
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.client.should.equal(idClient.toString());
                res.body.place.should.equal(idPlace.toString());
                let client = await Client.findById(idClient);
                let place = await Place.findById(idPlace);
                client.ratings.should.lengthOf(1);
                place.ratings.should.lengthOf(1);
                client.ratings.should.include(res.body._id);
                place.ratings.should.include(res.body._id);
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var complaint = await Rating.create({
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/ratings/' + complaint._id)
                        .send({
                            client: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    complaint = await Rating.findById(complaint._id);
                    should.equal(complaint.client,undefined);
                    should.equal(complaint.place,undefined);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var complaint = await Rating.create({
                        client : idClient,
                        place : idPlace
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/ratings/' + complaint._id)
                        .send({
                            client: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    complaint = await Rating.findById(complaint._id);
                    let place = await Place.findById(idPlace);
                    let client = await Client.findById(idClient);
                    complaint.client.should.eql(client._id);
                    complaint.place.should.eql(place._id);
                    place.ratings.should.include(complaint._id);
                    client.ratings.should.include(complaint._id);
                }
            });
        });

        describe('delete', function () {
            let idClient = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;

            before(async function () {
                let client = await Client.create({
                    _id: idClient,
                    name: 'Tasik',
                    surname: 'Parasik'
                });
                let place = await Place.create({
                    _id: idPlace,
                    email: 'nluasd@asd.ccc',
                    phone: '38684854214'
                });
            });
            after(async function () {
                await Rating.remove();
                await Client.remove();
                await Place.remove();
            });
            it('normal delete model with relations', async function () {
                let complaint = await Rating.create({
                    client: idClient,
                    place: idPlace
                });
                let res = await chai.request('localhost:3000')
                    .delete('/api/ratings/' + complaint._id);
                res.status.should.equal(204);
                let client = await Client.findById(idClient);
                let place = await Place.findById(idPlace);
                client.ratings.should.lengthOf(0);
                place.ratings.should.lengthOf(0);
                client.ratings.should.not.include(complaint._id);
                place.ratings.should.not.include(complaint._id);
            });
        });
    });
});