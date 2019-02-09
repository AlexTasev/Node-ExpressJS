const mongoose = require('mongoose');
const User = require('../models/User');
mongoose.Promise = global.Promise;
module.exports = config => {
    mongoose.connect(config.dbPath, {
        useNewUrlParser: true
    });
    const db = mongoose.connection;
    db.once('open', err => {
        if (err) {
            console.log(err);
        }

        User.seedAdmin()
            .then(() => {
                console.log('Database ready');
            }).catch((err) => {
                console.error(err)
            })
    });

    db.on('error', reason => {
        console.log(reason);
    });
};