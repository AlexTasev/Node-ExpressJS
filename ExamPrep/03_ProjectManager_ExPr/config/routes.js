const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);

    // GUEST

    app.get('/register', restrictedPages.isAnonymous, controllers.user.registerGet);
    app.post('/register', restrictedPages.isAnonymous, controllers.user.registerPost);
    app.post('/logout', restrictedPages.isAuthed, controllers.user.logout);
    app.get('/login', restrictedPages.isAnonymous, controllers.user.loginGet);
    app.post('/login', restrictedPages.isAnonymous, controllers.user.loginPost);

    // ADMIN

    app.get('/team/create', restrictedPages.hasRole("Admin"), controllers.team.createGet);
    app.post('/team/create', restrictedPages.hasRole("Admin"), controllers.team.createPost);

    app.get('/project/create', restrictedPages.hasRole("Admin"), controllers.project.createGet);
    app.post('/project/create', restrictedPages.hasRole("Admin"), controllers.project.createPost);

    app.get('/admin/teams', restrictedPages.hasRole("Admin"), controllers.team.distributeGet);
    app.post('/admin/teams', restrictedPages.hasRole("Admin"), controllers.team.distributePost);

    app.get('/admin/projects', restrictedPages.hasRole("Admin"), controllers.project.distributeGet);
    app.post('/admin/projects', restrictedPages.hasRole("Admin"), controllers.project.distributePost);

    //  USER

    app.get('/user/teams', restrictedPages.isAuthed, controllers.team.allGet);
    app.get('/searchTeams', restrictedPages.isAuthed, controllers.team.searchTeams);

    app.get('/user/projects', restrictedPages.isAuthed, controllers.project.allGet);
    app.get('/searchProjects', restrictedPages.isAuthed, controllers.project.searchProjects)

    app.get('/user/profile', restrictedPages.isAuthed, controllers.user.getProffile);

    app.post('/leaveTeam/:id', restrictedPages.isAuthed, controllers.user.leaveTeam)


    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};