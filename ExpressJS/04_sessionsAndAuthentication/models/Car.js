const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    model: {
        type: Schema.Types.String,
        required: true
    },
    imageUrl: {
        type: Schema.Types.String,
        required: true
    },
    pricePerDay: {
        type: Schema.Types.Number,
        required: true
    },
    isRented: {
        type: Schema.Types.Boolean,
        default: false
    }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;