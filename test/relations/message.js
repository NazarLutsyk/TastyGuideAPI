require('../../config/path');
let Message = require('../../models/Message');
let Client = require('../../models/Client');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('message relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idCLient1 = new mongoose.Types.ObjectId;
            let idCLient2 = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let sender = await Client.create({
                    _id: idCLient1,
                    name: 'Tasik',
                    surname: 'Parasik'
                });
                let receiver = await Client.create({
                    _id: idCLient2,
                    name: 'nluasd@asd.ccc',
                    surname: '38684854214'
                });
            });
            afterEach(async function () {
                await Message.remove();
                await Client.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/messages')
                    .send({
                        sender: idCLient1,
                        receiver: idCLient2,
                        value : 'aaaa'
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.sender.should.equal(idCLient1.toString());
                res.body.receiver.should.equal(idCLient2.toString());
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/messages')
                        .send({
                            sender: new mongoose.Types.ObjectId,
                            receiver: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('delete', function () {
            let idClient1 = new mongoose.Types.ObjectId;
            let idClient2 = new mongoose.Types.ObjectId;

            before(async function () {
                let sender = await Client.create({
                    _id: idClient1,
                    name: 'Tasik',
                    surname: 'Parasik'
                });
                let receiver = await Client.create({
                    _id: idClient2,
                    name: 'nluasd@asd.ccc',
                    surname: '38684854214'
                });
            });
            after(async function () {
                await Message.remove();
                await Client.remove();
            });
            it('normal delete model with relations', async function () {
                let complaint = await Message.create({
                    sender: idClient1,
                    receiver: idClient2,
                    value : 'aaaa'
                });
                let res = await chai.request('localhost:3000')
                    .delete('/api/messages/' + complaint._id);
                res.status.should.equal(204);
            });
        });
    });
});