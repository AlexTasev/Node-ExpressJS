const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const cubeSchema = new Schema({
    name: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: true },
    imageUrl: { type: Schema.Types.String, required: true },
    difficulty: { type: Schema.Types.Number, required: true }
});

cubeSchema.path('name')
    .validate(function () {
        return this.name.lenght >= 3 && this.name.lenght <= 15;
    }, 'Name must be between 3 and 15 symbols!');

cubeSchema.path('description')
    .validate(function () {
        return this.description.lenght >= 20 && this.description.lenght <= 300;
    }, 'Description must be between 20 and 300 symbols');

cubeSchema.path('imageUrl')
    .validate(function () {
        return this.imageUrl.startsWith('http') &&
            (this.imageUrl.endsWith('.jpg') || this.imageUrl.endsWith('.png'));
    }, 'Image URL must start with "http" or ends with .jpg or .png');

cubeSchema.path('difficulty')
    .validate(function () {
        return this.difficulty.lenght >= 1 && this.difficulty.lenght <= 6;
    }, 'Difficulty should be between 1 and 6');

const Cube = mongoose.model('Cube', cubeSchema);

module.exports = Cube;

