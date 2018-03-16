require('../../config/path');
let Promo = require('../../models/Promo');
let Place = require('../../models/Place');
let Image = require('../../models/Image');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('image relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('delete', function () {
            it('normal delete model with relations', async function () {
                let image = await Image.create({});
                let place = await Place.create({
                    phone: '233232323223',
                    email: 'asdasd@sada.sds',
                    images: [image._id]
                });
                let promo = await Promo.create({
                    image: image._id
                });
                let res = await chai.request('localhost:3000')
                    .delete('/api/images/' + image._id);
                res.status.should.equal(204);

                image = await Image.findById(image._id);
                place = await Place.findById(place._id);
                promo = await Promo.findById(promo._id);

                should.equal(image,null);
                should.equal(place.images.length,0);
                should.equal(promo.image,null);
            });
        });
    });
});