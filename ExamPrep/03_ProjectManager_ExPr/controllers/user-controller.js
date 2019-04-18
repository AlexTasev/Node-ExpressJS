const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const Team = require('../models/Team')

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);
        try {
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                profilePicture: reqUser.profilePicture,
                roles: []
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/register', user);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/register');
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({
                username: reqUser.username
            });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                errorHandler('Invalid user data');
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
        }

        function errorHandler(e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/login');
        }
    },

    getProffile: async (req, res) => {
        let userId = req.user._id;
        let user = await User.findById(userId);
        let teams = await Team.find({
                members: {
                    "$in": [userId]
                }
            })
            .populate('projects')

        res.render('users/profile', {
            user,
            teams
        });
    },

    leaveTeam: async (req, res) => {
        let userId = req.user._id;
        let teamId = req.params.id;
        let user = await User.findById(userId);
        let team = await Team.findById(teamId);
        user.teams.pop(teamId);
        team.members.pop(userId);
        Promise.all([user.save(), team.save()])
        
        res.redirect('/user/profile')
    }
};