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
            it('normal create model with used relations', async function () {
                let oldDepartment = new Department({
                    startDate: new Date(),
                    endDate: new Date()
                });
                oldDepartment = await oldDepartment.superupdate(Department,{
                    promos: [idPromo]
                });
                let res = await chai.request('localhost:3000')
                    .post('/api/departments')
                    .send({
                        promos: [idPromo]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.promos.should.lengthOf(1);
                res.body.promos.should.include(idPromo.toString());

                let promo = await Promo.findById(idPromo);
                oldDepartment = await Department.findById(oldDepartment);

                promo.author.toString().should.equal(res.body._id.toString());
                should.equal(oldDepartment.promos.length,0);
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
                department = await department.supersave(Department);
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
                    department = await department.supersave(Department);
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
            it('update model with used relations', async function () {
                let oldDepartment = new Department({});
                oldDepartment = await oldDepartment.superupdate(Department,{
                    promos: [idPromo]
                });
                let newDepartment = await Department.create({
                });
                let res = await chai.request('localhost:3000')
                    .put('/api/departments/'+newDepartment._id)
                    .send({
                        promos: [idPromo]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.promos.should.lengthOf(1);
                res.body.promos.should.include(idPromo.toString());

                oldDepartment = await Department.findById(oldDepartment._id);
                let promo = await Promo.findById(idPromo);

                promo.author.toString().should.equal(res.body._id.toString());
                should.equal(oldDepartment.promos.length,0);
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
                department = await department.supersave(Department);
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


});