const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cubeSchema = new Schema({
    name: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: true },
    imageUrl: { type: Schema.Types.String, required: true },
    difficulty: { type: Schema.Types.Number, required: true }
});
            //Validation
cubeSchema
    .path('name')
    .validate(function () {
        return this.name.length >= 3 && this.name.length <= 15;
    }, 'Name should be between 3 and 15 characters');

cubeSchema
    .path('description')
    .validate(function () {
        return this.description.length >= 20 && this.description.length <= 300;
    }, 'Description should be between 20 and 300 characters');

cubeSchema
    .path('imageUrl')
    .validate(function () {
        return this.imageUrl.startsWith('http')
            && this.imageUrl.endsWith('.png') || this.imageUrl.endsWith('.jpg');
    }, 'The image should shtart with http and should end with .png or .jpg');

cubeSchema
    .path('difficulty')
    .validate(function () {
        return this.difficulty >= 1 && this.difficulty <= 6;
    }, 'Difficulty should be between 1 and 6');


const Cube = mongoose.model('Cube',cubeSchema);
module.exports = Cube;