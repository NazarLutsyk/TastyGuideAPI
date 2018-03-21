let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let HashTagSchema = new Schema({
    value: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('HashTag', HashTagSchema);