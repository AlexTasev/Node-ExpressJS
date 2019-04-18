const Project = require("../models/Project")
const Team = require("../models/Team")

module.exports = {
    createGet: (req, res) => {
        res.render('projects/create')
    },

    createPost: (req, res) => {
        const name = req.body.name;
        const description = req.body.description;

        Project
            .create({
                name,
                description
            })
            .then(() => {
                res.redirect('/')
            }).catch(err => {
                res.locals.globalError = err;
            })
    },

    distributeGet: (req, res) => {
        let teams = Team.find();
        let projects = Project.find({
            team: undefined
        });
        Promise.all([teams, projects])
            .then(([teams, projects]) => {
                res.render('projects/distribute', {
                    teams,
                    projects
                });
            })
            .catch(err => {
                res.locals.globalError = err;
            })
    },

    distributePost: async (req, res) => {
        try {
            let {
                teamId,
                projectId
            } = req.body;

            let team = await Team.findById(teamId);
            let project = await Project.findById(projectId);

            team.projects.push(projectId);
            project.team = teamId;
            await team.save();
            await project.save();

            res.redirect('/');

        } catch (err) {
            res.locals.globalError = err;
        }
    },

    allGet: async (req, res) => {
        let projects = await Project.find()
            .populate("team")

        res.render('projects/projects', {
            projects
        })
    },

    searchProjects: async (req, res) => {
        let query = req.query.title.toLowerCase();

        let projects = await Project.find()
            .populate('team');

        let filteredProjects = projects
            .filter((project) => {
                return project.name.toLowerCase().includes(query)
            });


        res.render('projects/projects', {
            projects: filteredProjects
        })
    }
}