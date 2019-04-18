const Team = require("../models/Team");
const User = require("../models/User");
const Projects = require("../models/Project");


module.exports = {
    createGet: (req, res) => {
        res.render('teams/create')
    },

    createPost: (req, res) => {
        try {
            const name = req.body.name;
            Team
                .create({
                    name
                })
                .then(() => {
                    res.redirect('/')
                })
                .catch((err) => {
                    res.locals.globalError = err;
                })
        } catch (err) {
            res.locals.globalError = err
        }
    },

    distributeGet: async (req, res) => {
        try {
            let users = await User.find();
            let teams = await Team.find();

            res.render('teams/distribute', {
                users,
                teams
            })
        } catch (err) {
            res.locals.globalError = err
        }
    },

    distributePost: async (req, res) => {
        try {
            let {
                userId,
                teamId
            } = req.body;

            let user = await User.findById(userId);
            let team = await Team.findById(teamId);

            user.teams.push(team);
            await user.save();

            if (team.members.indexOf(userId) !== -1) {
                res.locals.globalError = "Can not put user in the same team";
                res.redirect("/");
            } else {
                team.members.push(user);
                await team.save();
                res.redirect("/");
            }
        } catch (err) {
            res.locals.globalError = err;
        }
    },

    allGet: async (req, res) => {
        try {
            let teams = await Team.find()
                .populate('members')
                .populate('projects');

            res.render('teams/teams', {
                teams
            });

        } catch (err) {
            res.locals.globalError = err;
        }
    },

    searchTeams: async (req, res) => {
        try {
            let query = req.query.teamName.toLowerCase();

            let teams = await Team.find()
                .populate('members')
                .populate('projects');

            let filteredTeams = teams.filter((t) => {
                return t.name.toLowerCase().includes(query)
            });

            res.render('teams/teams', {
                teams: filteredTeams
            })
        } catch (err) {
            res.locals.globalError = err;
        }
    }
}