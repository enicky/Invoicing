/*jshint: laxcomma:true */

var fs = require('fs');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var hostname = require('os').hostname();
var express = require('express');
var routes = require('./routes');
var path = require('path');
var cfg = require(path.join(__dirname, 'configuration', "config"));
var app = express();
var env = (process.env.NODE_ENV || 'DEVELOPMENT').toLowerCase();
var winston = require('winston');
var npid = require('npid');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var MongoManager = require('./lib/mongomanager');
//test


passport.serializeUser(function(user, done) {
    console.log('serial');
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('deserial');
    done(null, user);
});


passport.use(new LocalStrategy(
    function(username, password, done) {
        var du = cfg.default_user;
        console.log('default user : ', du);
        console.log('-------------------');
        console.log('username : ', username);
        console.log('password : ', password);
        if(du.username == username && du.password == password){
            return done(null, du);
        }else if(du.username != username){
            return done(null, false, { message : 'incorrect username'});
        }else if(du.password != password){
            return done(null, false, { message : 'incorrect password'});
        }

    }
));

var targetLogPath = cfg.logger.log_dir;

var transports = [];

transports.push(new winston.transports.Console({
    level : 'debug',
    colorize : true
}));
transports.push(new winston.transports.DailyRotateFile({
    name: 'file',
    datePattern: '.yyyy-MM-ddTHH',
    filename: path.join(targetLogPath, 'somefile.log'),
    level : 'verbose',
    json: false
}));

var Logger = new winston.Logger({transports: transports});

winston.addColors({debug: 'green',info:  'cyan',silly: 'magenta',warn:  'yellow',error: 'red'});

Logger.level = 'debug';
/*
 if (cluster.isMaster) {
 Logger.log('info',"Master is forking workers");
 for (var i=0; i<numCPUs; ++i) {
 cluster.fork();
 }
 return;
 }
 */
npid.create(path.join(__dirname, "pids", ("pid." + process.pid) ));

Logger.log('info',"Initiating worker, pid:" + process.pid);

var mongoManager = new MongoManager({
    Logger : Logger
});

mongoManager.init();

app.configure(function(){
    app.set('port', process.env.PORT || 1337);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.set('logger', Logger);
    app.set('mongo', mongoManager);

    app.use(express.favicon());
    app.use( express.cookieParser('blabla') );
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'keyboard cat' , cookie : {maxAge : 60000}}));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/error', routes.getError);

app.get('/', routes.index);
app.get('/login', routes.getLogin);

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
        Logger.log('info','Authentication is done ... redirect naar index page');
        res.redirect('/authenticated/index');
    });

app.get('/logout', routes.getLogout);


subcategory_ids = [  ];

//AUTHENTICATED
app.get('/authenticated/index', routes.authenticatedIndex);
/*
app.get('/authenticated/index', routes.authenticatedIndex);
app.get('/authenticated/logs', routes.authenticatedLogs);
app.get('/authenticated/logs/all', routes.authenticatedLogsAll);
app.get('/authenticated/logs/unsent', routes.authenticatedLogsUnsent);
app.get('/autheticated/devices', routes.authenticatedShowDevices);
app.get('/authenticated/sensors', routes.authenticatedShowSensors);
app.get('/authenticated/readings', routes.authenticatedShowReadings);

//UPDATES
app.get('/authenticated/updates', routes.authenticatedShowUpdates);

//API
app.get('/api/registerdevice/:serial', routes.registerDevice);
app.get('/api/application/start', routes.applicationStart);


//API TESTING
app.post('/api/deviceAdd', routes.deviceAdd);
app.post('/api/sensorAdd', routes.sensorAdd);
app.post('/api/readingAdd', routes.readingAdd);
*/
app.listen(app.get('port'), function(){
    Logger.log('info',"Express".green.bold + " server listening on port " + (app.get('port')+ "").green.bold);
});

Logger.log('info',"Started.");
