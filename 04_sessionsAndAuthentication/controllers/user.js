const encryption = require('../util/encryption');
const User = require('../models/User');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        const userBody = req.body;
        if (!userBody.username || !userBody.password || !userBody.repeatPassword) {
            userBody.error = 'Please fill all fields!';
            res.render('user/register', userBody);
            return;
        }
        if (userBody.password !== userBody.repeatPassword) {
            userBody.error = 'Both passwords should match!';
            res.render('user/register', userBody);
        }

        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, userBody.password);

        try {
            const user = await User.create({
                username: userBody.username,
                hashedPass,
                salt,
                firstName: userBody.firstName,
                lastName: userBody.lastName,
                roles: ['User'],
            });
            req.logIn(user, (err) => {
                if (err) {
                    userBody.error = err;
                    res.render('user/register');
                } else {
                    res.redirect('/');
                }
            })
        } catch (err) {
            console.log(err);
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/')
    },
    loginGet: (req, res) => {
        res.render('user/login')
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;

        try {
            const user = await User.findOne({
                username: reqUser.username
            });
            if (!user) {
                reqUser.error = 'Invalid username';
                res.render('user/login', reqUser);
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                reqUser.error = 'Invalid password';
                res.render('user/login', reqUser);
                return;
            }
            req.logIn(user, (err) => {
                if (err) {
                    reqUser.error = err;
                    res.render('user/login', reqUser);
                } else {
                    res.redirect('/')
                }
            })
        } catch (err) {
            reqUser.error = 'Something went wrong';
            res.render('user/login', reqUser);
        }
    },
    myRents: (req,res)=> {
        
    }
};