require('../../config/path');
let Bonuse = require('../../models/Bonuse');
let Multilang = require('../../models/BonuseMultilang');
let Place = require('../../models/Place');
let Image = require('../../models/Image');
let Department = require('../../models/Department');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('bonuse relations', function () {
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
                    description: 'sdsd',
                    conditions: 'asd'
                });
                await Multilang.create({
                    _id: idMultilang2,
                    header: 'asdasd',
                    description: 'sdsd',
                    conditions: 'asd'
                });
                await Image.create({
                    _id: idImage,
                });
                await Department.create({
                    _id: idDepartment,
                });
            });
            afterEach(async function () {
                await Bonuse.remove({});
                await Multilang.remove({});
                await Place.remove({});
                await Image.remove({});
                await Department.remove({});
            });
            it('normal create model with used relations', async function () {
                let oldBonuse = new Bonuse({
                    startDate: new Date(),
                    endDate: new Date()
                });
                oldBonuse = await oldBonuse.superupdate(Bonuse, {
                    multilang: [idMultilang1, idMultilang2]
                });
                let res = await chai.request('localhost:3000')
                    .post('/api/bonuses')
                    .send({
                        startDate: new Date(),
                        endDate: new Date(),
                        multilang: [idMultilang1, idMultilang2]
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.multilang.should.lengthOf(2);
                res.body.multilang.should.include(idMultilang1.toString());
                res.body.multilang.should.include(idMultilang2.toString());

                let oldMultilang1 = await Multilang.findById(idMultilang1);
                let oldMultilang2 = await Multilang.findById(idMultilang2);
                oldBonuse = await Bonuse.findById(oldBonuse);

                oldMultilang1.bonuse.toString().should.equal(res.body._id.toString());
                oldMultilang2.bonuse.toString().should.equal(res.body._id.toString());
                should.equal(oldBonuse.multilang.length, 0);
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/bonuses')
                    .send({
                        startDate: new Date(),
                        endDate: new Date(),
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
                oldMultilang1.bonuse.toString().should.equal(res.body._id.toString());
                oldMultilang2.bonuse.toString().should.equal(res.body._id.toString());
            });

            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/bonuses')
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
            let idBonuse = new mongoose.Types.ObjectId;
            beforeEach(async function () {
                await Place.create({
                    _id: idPlace,
                    phone: '35545754222',
                    email: 'asdas2asd@asdd.sad'
                });
                await Multilang.create({
                    _id: idMultilang1,
                    header: 'asdasd',
                    description: 'sdsd',
                    conditions: 'asd'
                });
                await Multilang.create({
                    _id: idMultilang2,
                    header: 'asdasd',
                    description: 'sdsd',
                    conditions: 'asd'
                });
                await Image.create({
                    _id: idImage,
                });
                await Department.create({
                    _id: idDepartment,
                });
                await Bonuse.create({
                    _id: idBonuse,
                    startDate: new Date(),
                    endDate: new Date(),
                });
            });
            afterEach(async function () {
                await Bonuse.remove({});
                await Multilang.remove({});
                await Place.remove({});
                await Image.remove({});
                await Department.remove({});
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/bonuses/' + idBonuse)
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
                oldMultilang1.bonuse.toString().should.equal(res.body._id.toString());
                oldMultilang2.bonuse.toString().should.equal(res.body._id.toString());
            });
            it('should delete old relation and add new', async function () {
                let newPlace = await Place.create({
                    phone: '35545754222',
                    email: 'asdas2asd@asdd.sad'
                });
                let newMultilang1 = await Multilang.create({
                    header: 'asdasd',
                    description: 'sdsd',
                    conditions: 'asd'
                });
                let newImage = await Image.create({});
                let newDepartment = await Department.create({});
                let bonuse = new Bonuse({
                    author: idDepartment,
                    place: idPlace,
                    image: idImage,
                    multilang: [idMultilang1, idMultilang2],
                    startDate: new Date(),
                    endDate: new Date(),
                });
                bonuse = await bonuse.supersave(Bonuse);

                let res = await chai.request('localhost:3000')
                    .put('/api/bonuses/' + bonuse._id)
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
                newMultilang1.bonuse.toString().should.equal(res.body._id.toString());

                should.equal(oldDepartment.promos.length, 0);
                should.equal(oldPlace.promos.length, 0);
                should.equal(oldMultilang1.bonuse, null);
                should.equal(oldMultilang2.bonuse, null);
            });

            it('invalid update empty model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .put('/api/bonuses/' + idBonuse)
                        .send({
                            author: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId,
                            image: new mongoose.Types.ObjectId,
                            multilang: [new mongoose.Types.ObjectId]
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    let bonuse = await Bonuse.findById(idBonuse);
                    should.equal(e.status, 400);
                    should.equal(bonuse.author, undefined);
                    should.equal(bonuse.image, undefined);
                    should.equal(bonuse.place, undefined);
                    should.equal(bonuse.multilang.length, 0);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var bonuse = new Bonuse({
                        author: idDepartment,
                        place: idPlace,
                        image: idImage,
                        multilang: [idMultilang1, idMultilang2],
                        startDate: new Date(),
                        endDate: new Date(),
                    });
                    bonuse = await bonuse.supersave(Bonuse);
                    let res = await chai.request('localhost:3000')
                        .put('/api/bonuses/' + idBonuse)
                        .send({
                            author: new mongoose.Types.ObjectId,
                            place: new mongoose.Types.ObjectId,
                            image: new mongoose.Types.ObjectId,
                            multilang: [new mongoose.Types.ObjectId]
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    bonuse = await Bonuse.findById(bonuse._id);
                    bonuse.author.toString().should.equal(idDepartment.toString());
                    bonuse.place.toString().should.equal(idPlace.toString());
                    bonuse.image.toString().should.equal(idImage.toString());
                    bonuse.multilang.should.lengthOf(2);
                    bonuse.multilang.should.include(idMultilang1.toString());
                    bonuse.multilang.should.include(idMultilang2.toString());

                    let oldDepartment = await Department.findById(idDepartment);
                    let oldPlace = await Place.findById(idPlace);
                    let oldMultilang1 = await Multilang.findById(idMultilang1);
                    let oldMultilang2 = await Multilang.findById(idMultilang2);

                    oldDepartment.promos.should.lengthOf(1);
                    oldDepartment.promos.should.include(bonuse._id.toString());
                    oldPlace.promos.should.lengthOf(1);
                    oldPlace.promos.should.include(bonuse._id.toString());
                    oldMultilang1.bonuse.toString().should.equal(bonuse._id.toString());
                    oldMultilang2.bonuse.toString().should.equal(bonuse._id.toString());
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
                    description: 'sdsd',
                    conditions: 'asd'
                });
                await Multilang.create({
                    _id: idMultilang2,
                    header: 'asdasd',
                    description: 'sdsd',
                    conditions: 'asd'
                });
                await Image.create({
                    _id: idImage,
                });
                await Department.create({
                    _id: idDepartment,
                });
            });
            afterEach(async function () {
                await Bonuse.remove({});
                await Multilang.remove({});
                await Place.remove({});
                await Image.remove({});
                await Department.remove({});
            });
            it('normal delete model with relations', async function () {
                let bonuse = new Bonuse({
                    author: idDepartment,
                    place: idPlace,
                    image: idImage,
                    multilang: [idMultilang1, idMultilang2],
                    startDate: new Date(),
                    endDate: new Date(),
                });
                bonuse = await bonuse.supersave(Bonuse);
                let res = await chai.request('localhost:3000')
                    .delete('/api/bonuses/' + bonuse._id);

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
})
;