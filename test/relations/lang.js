require('../../config/path');
let Lang = require('../../models/Lang');
let Multilang = require('../../models/Multilang');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('lang relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('delete', function () {
            let idMultilang = new mongoose.Types.ObjectId;
            let idLang = new mongoose.Types.ObjectId;

            before(async function () {
                await Lang.create({
                    _id : idLang,
                    name : 'aaa'
                });
                await Multilang.create({
                    _id: idMultilang,
                    lang: idLang,
                });
            });
            after(async function () {
                await Lang.remove();
                await Multilang.remove();
            });
            it('normal delete model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .delete('/api/langs/' + idLang);
                res.status.should.equal(204);
                let multilang = await Multilang.findById(idMultilang);
                should.equal(multilang.lang,null);
            });
        });
    });
});