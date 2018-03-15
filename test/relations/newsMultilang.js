require('../../config/path');
let NewsMultilang = require('../../models/NewsMultilang');
let News = require('../../models/News');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mongoose = require('mongoose');
let should = chai.should();

chai.use(chaiHttp);

describe('news multilang relations', function () {
    this.timeout(5000);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/drinker');

    describe('normal', function () {
        describe('post', function () {
            let idNews = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let news = await News.create({
                    _id: idNews,
                });
            });
            afterEach(async function () {
                await NewsMultilang.remove();
                await News.remove();
            });
            it('normal create model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .post('/api/newsMultilangs')
                    .send({
                        header : 'asdasd',
                        description : 'asda',
                        news: idNews
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.news.should.equal(idNews.toString());
                let news = await News.findById(idNews);
                news.multilang.should.include(res.body._id.toString());
            });
            it('invalid create model with wrong relations', async function () {
                try {
                    let res = await chai.request('localhost:3000')
                        .post('/api/newsMultilangs')
                        .send({
                            header : 'asdasd',
                            description : 'asda',
                            news: new mongoose.Types.ObjectId,
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                }
            });
        });

        describe('update', function () {
            let idNews = new mongoose.Types.ObjectId;
            let idMultilang = new mongoose.Types.ObjectId;

            beforeEach(async function () {
                let news = await News.create({
                    _id: idNews,
                });
                let multilang = await NewsMultilang.create({
                    _id: idMultilang,
                    header : 'asdasd',
                    description : 'asda',
                });
            });
            afterEach(async function () {
                await NewsMultilang.remove();
                await News.remove();
            });
            it('normal update empty model with relations', async function () {
                let res = await chai.request('localhost:3000')
                    .put('/api/newsMultilangs/' + idMultilang)
                    .send({
                        news: idNews
                    });
                res.status.should.equal(201);
                res.body.should.be.an('object');
                res.body.news.should.equal(idNews.toString());
                let news = await News.findById(idNews);
                news.multilang.should.include(res.body._id.toString());
            });
            it('invalid update empty model with wrong relations', async function () {
                try {
                    var multilang = await NewsMultilang.create({
                        header : 'asdasd',
                        description : 'asda',
                    });
                    let res = await chai.request('localhost:3000')
                        .put('/api/newsMultilangs/' + multilang._id)
                        .send({
                            news: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    multilang = await NewsMultilang.findById(multilang._id);
                    should.equal(multilang.news,undefined);
                }
            });
            it('invalid update model with wrong relations', async function () {
                try {
                    var multilang = new NewsMultilang({
                        header : 'asdasd',
                        description : 'asda',
                        news : idNews
                    });
                    multilang = await multilang.supersave();

                    let res = await chai.request('localhost:3000')
                        .put('/api/newsMultilangs/' + multilang._id)
                        .send({
                            news: new mongoose.Types.ObjectId
                        });
                    if (res.status) should.fail();
                } catch (e) {
                    should.equal(e.status, 400);
                    multilang = await NewsMultilang.findById(multilang._id);
                    let news = await News.findById(idNews);
                    multilang.news.should.eql(news._id);
                    news.multilang.should.include(multilang._id);
                }
            });
        });

        describe('delete', function () {
            let idNews = new mongoose.Types.ObjectId;

            before(async function () {
                let news = await News.create({
                    _id: idNews,
                });
            });
            after(async function () {
                await NewsMultilang.remove();
                await News.remove();
            });
            it('normal delete model with relations', async function () {
                let multilang = new NewsMultilang({
                    header : 'asdasd',
                    description : 'asda',
                    news : idNews
                });
                multilang = await multilang.supersave();
                let res = await chai.request('localhost:3000')
                    .delete('/api/newsMultilangs/' + multilang._id);
                res.status.should.equal(204);
                let news = await News.findById(idNews);
                should.equal(news.multilang.length,0)
            });
        });
    });
});