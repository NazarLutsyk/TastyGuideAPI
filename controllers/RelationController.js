let ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    async addRelation(req, res) {
        try {
            let Model1 = require('../models/' + req.params.model1);
            let Model2 = require('../models/' + req.params.model2);
            let id1 = req.params.id1;
            let id2 = req.params.id2;
            let field1 = req.query.fields.split(',')[0];
            let field2 = req.query.fields.split(',')[1];
            let model1 = await Model1.findById(id1);
            let model2 = await Model2.findById(id2);
            if (model1 && model2) {
                if (Array.isArray(model1[field1])) {
                    await Model1.findByIdAndUpdate(id1, {$push: {[field1]: id2}});
                } else {
                    await Model1.findByIdAndUpdate(id1, {[field1]: id2});
                }
                if (Array.isArray(model2[field2])) {
                    await Model2.findByIdAndUpdate(id2, {$push: {[field2]: id1}});
                } else {
                    await Model2.findByIdAndUpdate(id2, {[field2]: id1});
                }
                return res.sendStatus(201);
            } else {
                throw new Error('Allahu akbar');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeRelation(req, res) {
        try {
            let Model1 = require('../models/' + req.params.model1);
            let Model2 = require('../models/' + req.params.model2);
            let id1 = req.params.id1;
            let id2 = req.params.id2;
            let field1 = req.query.fields.split(',')[0];
            let field2 = req.query.fields.split(',')[1];
            let model1 = await Model1.findById(id1);
            let model2 = await Model2.findById(id2);
            if (model1 && model2) {
                if (Array.isArray(model1[field1])) {
                    await Model1.findByIdAndUpdate(id1, {$pull: {[field1]: id2}});
                } else {
                    await Model1.findByIdAndUpdate(id1, {[field1]: null});
                }
                if (Array.isArray(model2[field2])) {
                    await Model2.findByIdAndUpdate(id2, {$pull: {[field2]: id1}});
                } else {
                    await Model2.findByIdAndUpdate(id2, {[field2]: null});
                }
                return res.sendStatus(201);
            } else {
                throw new Error('Allahu akbar');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
}
;