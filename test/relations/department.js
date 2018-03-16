require('../../config/path');
let Department = require('../../models/Department');
let Client = require('../../models/Client');
let Place = require('../../models/Place');
let Promo = require('../../models/Promo');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('department relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idClient = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;
            let idPromo = new mongoose.Types.ObjectId;

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
                let promos = await Promo.create({
                    _id: idPromo,
                });
            });
            afterEach(async function () {
                await Department.remove();
                await Client.remove();
                await Place.remove();
                await Promo.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/departments')
                    .send({
                        client: idClient,
                        place: idPlace,
                        promos: [idPromo]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.client.should.equal(idClient.toString());
                res.body.place.should.equal(idPlace.toString());
                res.body.promos.should.lengthOf(1);
                res.body.promos.should.include(idPromo.toString());
                let client = await Client.findById(idClient);
                let place = await Place.findById(idPlace);
                let promos = await Promo.findById(idPromo);
                client.departments.should.lengthOf(1);
                place.departments.should.lengthOf(1);
                client.departments.should.include(res.body._id);
                place.departments.should.include(res.body._id);
                promos.author.toString().should.equal(res.body._id.toString());
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/departments')
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
            let idDepartment = new mongoose.Types.ObjectId;
            let idPromo = new mongoose.Types.ObjectId;

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
                let department = await Department.create({
                    _id: idDepartment,
                });
                let promos = await Promo.create({
                    _id: idPromo,
                });
            });
            afterEach(async function () {
                await Department.remove();
                await Client.remove();
                await Place.remove();
                await Promo.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/departments/' + idDepartment)
                    .send({
                        client: idClient,
                        place: idPlace,
                        promos: [idPromo]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.client.should.equal(idClient.toString());
                res.body.place.should.equal(idPlace.toString());
                res.body.promos.should.lengthOf(1);
                res.body.promos.should.include(idPromo.toString());
                let client = await Client.findById(idClient);
                let place = await Place.findById(idPlace);
                let promos = await Promo.findById(idPromo);
                client.departments.should.lengthOf(1);
                place.departments.should.lengthOf(1);
                client.departments.should.include(res.body._id);
                place.departments.should.include(res.body._id);
                promos.author.toString().should.equal(res.body._id.toString());
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var department = await Department.create({
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/departments/' + department._id)
                        .send({
                            client: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId,
                            promos: [new mongoose.Types.ObjectId],
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    department = await Department.findById(department._id);
                    should.equal(department.client,undefined);
                    should.equal(department.place,undefined);
                    should.equal(department.promos.length,0);
                }
            });
            it('should delete old relation and add new',async function () {
                let newPlace = await Place.create({
                    phone : '12323423423',
                    email : 'asdas@asd.asd',
                });
                let newClient = await Client.create({
                    name : '12323423423',
                    surname : 'asdas@asd.asd',
                });
                let newPromo = await Promo.create({
                });
                let department = new Department({
                    place : idPlace,
                    client: idClient,
                    promos: [idPromo]
                });
                department = await department.supersave();
                let res = await chai.request('localhost:3000')
                    .put('/api/departments/' + department._id)
                    .send({
                        place: newPlace._id,
                        client: newClient._id,
                        promos: [newPromo._id]
                    });

                newPlace = await Place.findById(newPlace._id);
                newClient = await Client.findById(newClient._id);
                newPromo = await Promo.findById(newPromo._id);
                let oldPlace = await Place.findById(idPlace);
                let oldClient = await Client.findById(idClient);
                let oldPromo = await Promo.findById(idPromo);

                res.body.place.toString().should.equal(newPlace._id.toString());
                res.body.client.toString().should.equal(newClient._id.toString());
                res.body.promos.should.lengthOf(1);
                res.body.promos.should.include(newPromo._id.toString());

                newPlace.departments.should.include(res.body._id.toString());
                newClient.departments.should.include(res.body._id.toString());
                newPromo.author.toString().should.equal(res.body._id.toString());

                should.equal(oldPlace.departments.length,0);
                should.equal(oldClient.departments.length,0);
                should.equal(oldPromo.author,null);
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var department = new Department({
                        client : idClient,
                        place : idPlace,
                        promos: [idPromo]
                    });
                    department = await department.supersave();
                    let res = await chai.request('localhost:3000')
                        .put('/api/departments/' + department._id)
                        .send({
                            client: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId,
                            promos: [new mongoose.Types.ObjectId],
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    department = await Department.findById(department._id);
                    let place = await Place.findById(idPlace);
                    let client = await Client.findById(idClient);
                    let promos = await Promo.findById(idPromo);
                    department.client.should.eql(client._id);
                    department.place.should.eql(place._id);
                    department.promos.should.lengthOf(1);
                    department.promos.should.include(promos._id);
                    place.departments.should.include(department._id);
                    client.departments.should.include(department._id);
                    promos.author.toString().should.equal(department._id.toString());
                }
            });
        });

        describe('delete', function () {
            let idClient = new mongoose.Types.ObjectId;
            let idPlace = new mongoose.Types.ObjectId;
            let idPromo = new mongoose.Types.ObjectId;

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
                let promos = await Promo.create({
                    _id: idPromo,
                });
            });
            after(async function () {
                await Department.remove();
                await Client.remove();
                await Place.remove();
                await Promo.remove();
            });
            it('normal delete model with relations', async function () {
                let department = Department({
                    client: idClient,
                    place: idPlace,
                    promos: [idPromo]
                });
                department = await department.supersave();
                let res = await chai.request('localhost:3000')
                    .delete('/api/departments/' + department._id);
                res.status.should.equal(204);
                let client = await Client.findById(idClient);
                let place = await Place.findById(idPlace);
                let promos = await Promo.findById(idPromo);
                client.departments.should.lengthOf(0);
                place.departments.should.lengthOf(0);
                client.departments.should.not.include(department._id);
                place.departments.should.not.include(department._id);
                should.equal(promos.author,null);
            });
        });
    });

    describe('push pull', function () {
        let idPromo = new mongoose.Types.ObjectId;
        beforeEach(async function () {
            await Promo.create({
                _id: idPromo,
            });
        });
        afterEach(async function () {
            await Promo.remove({});
            await Department.remove({});
        });
        describe('PUT', function () {
            it('should add relation to empty model', async function () {
                let author = await Department.create({});
                let res = await chai.request('localhost:3000')
                    .put(`/api/departments/${author._id}/promos/${idPromo}`);
                let promos = await Promo.findById(idPromo);
                author = await Department.findById(author._id);
                res.status.should.equal(201);
                promos.author.toString().should.equal(author._id.toString());
                author.promos.should.include(promos._id.toString());
            });
            it('should add relation to not empty model', async function () {
                let promo1 = await Promo.create({});
                let author = new Department({promos: [promo1._id]});
                author = await author.supersave();
                let res = await chai.request('localhost:3000')
                    .put(`/api/departments/${author._id}/promos/${idPromo}`);
                promo1 = await Promo.findById(promo1._id);
                let promo2 = await Promo.findById(idPromo);
                author = await Department.findById(author._id);
                res.status.should.equal(201);
                promo1.author.toString().should.equal(author._id.toString());
                promo2.author.toString().should.equal(author._id.toString());
                author.promos.should.include(promo1._id.toString());
                author.promos.should.include(promo2._id.toString());
                author.promos.should.lengthOf(2);
            });
            it('should not add duplicated relation', async function () {
                let author = new Department({promos: [idPromo]});
                author = await author.supersave();
                let res = await chai.request('localhost:3000')
                    .put(`/api/departments/${author._id}/promos/${idPromo}`);
                let promos = await Promo.findById(idPromo);
                author = await Department.findById(author._id);
                res.status.should.equal(201);
                promos.author.toString().should.equal(author._id.toString());
                author.promos.should.include(promos._id.toString());
                author.promos.should.lengthOf(1);
            });
            it('should not add wrong relation', async function () {
                try {
                    var author = await Department.create({});
                    let res = await chai.request('localhost:3000')
                        .put(`/api/departments/${author._id}/promos/${new mongoose.Types.ObjectId}`);
                    if (res.status) should.fail();
                } catch (e) {
                    author = await Department.findById(author._id);
                    e.status.should.equal(400);
                    should.equal(author.promos.length, 0);
                }
            });
        });
        describe('DELETE', function () {
            let idPromo = new mongoose.Types.ObjectId;
            let idPLaceType = new mongoose.Types.ObjectId;
            beforeEach(async function () {
                let promos = await Promo.create({
                    _id: idPromo,
                });
                let author = await Department({
                    _id : idPLaceType,
                    promos: [promos]
                });
                author = await author.supersave();
            });
            afterEach(async function () {
                await Promo.remove({});
                await Department.remove({});
            });
            it('should delete relation', async function () {
                let res = await chai.request('localhost:3000')
                    .delete(`/api/departments/${idPLaceType}/promos/${idPromo}`);
                let promos = await Promo.findById(idPromo);
                let author = await Department.findById(idPLaceType);
                res.status.should.equal(204);
                should.equal(promos.author,null);
                should.equal(author.promos.length,0);
            });
            it('should not remove wrong relation', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .delete(`/api/departments/${idPLaceType}/promos/${new mongoose.Types.ObjectId}`);
                } catch (e) {
                    let promos = await Promo.findById(idPromo);
                    let author = await Department.findById(idPLaceType);
                    e.status.should.equal(400);
                    should.equal(author.promos.length, 1);
                    should.equal(promos.author.toString(), author._id.toString());
                }
            });
        });
    });
});