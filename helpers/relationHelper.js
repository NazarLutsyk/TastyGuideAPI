module.exports = {
    async addRelation(model1, model2, id1, id2, field1, field2) {
        let Model1 = require(global.paths.MODELS + '/' + model1);
        let Model2 = require(global.paths.MODELS + '/' + model2);
        model1 = await Model1.findById(id1);
        model2 = await Model2.findById(id2);
        if (model1 && model2) {
            if (field1 && Array.isArray(model1[field1]) && model1[field1].indexOf(id2) == -1) {
                await Model1.findByIdAndUpdate(id1, {$push: {[field1]: id2}});
            } else if (field1 && !model1[field1]) {
                await Model1.findByIdAndUpdate(id1, {[field1]: id2});
            }
            if (field2 && Array.isArray(model2[field2]) && model2[field2].indexOf(id1) == -1) {
                await Model2.findByIdAndUpdate(id2, {$push: {[field2]: id1}});
            } else if (field2 && !model2[field2]) {
                await Model2.findByIdAndUpdate(id2, {[field2]: id1});
            }
            return true;
        } else {
            throw new Error('Validation error in add relation helper');
        }
    },
    async removeRelation(model1, model2, id1, id2, field1, field2) {
        let Model1 = require(global.paths.MODELS + model1);
        let Model2 = require(global.paths.MODELS + model2);
        model1 = await Model1.findById(id1);
        model2 = await Model2.findById(id2);
        if (model1 && model2) {
            if (field1 && Array.isArray(model1[field1])) {
                await Model1.findByIdAndUpdate(id1, {$pull: {[field1]: id2}});
            } else if (field1) {
                await Model1.findByIdAndUpdate(id1, {[field1]: null});
            }
            if (field2 && Array.isArray(model2[field2])) {
                await Model2.findByIdAndUpdate(id2, {$pull: {[field2]: id1}});
            } else if (field2) {
                await Model2.findByIdAndUpdate(id2, {[field2]: null});
            }
            return true;
        } else {
            throw new Error('Validation error in remove relation helper');
        }
    }
};