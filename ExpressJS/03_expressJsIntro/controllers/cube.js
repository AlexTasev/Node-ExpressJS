let Cube = require('../models/Cube');

function handleErrors(err, res, cubeBody) {
    let errors = [];
    for (let property in err.errors) {
        errors.push(err.errors[property].message);
    }

    res.locals.globalErrors = errors;
    res.render('cube/create', cubeBody);
}


module.exports = {
    createGet: (req, res) => {
        res.render('cube/create');
    },
    createPost: (req, res) => {
        const cubeBody = req.body;
        cubeBody.difficulty = Number(cubeBody.difficulty);

        Cube
            .create(cubeBody)
            .then((cube) => {
                res.redirect('/');
            })
            .catch(err => {
                handleErrors(err, res, cubeBody);
            });

    },
    details: (req, res) => {

        const cubeId = req.params.cubeId;

        Cube
            .findById(cubeId)
            .then((cube) => {
                res.render('cube/details', cube);
            })
            .catch((e) => console.log(e));
    }
};