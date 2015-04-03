//Set up common namespace for the application
//As this is the global namespace, it will be available across all modules
if(!global.App){
    global.App = {};
}

var express = require('express'),
    nconf = require('nconf'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    fs = require('fs'),
    extdirect = require('extdirect'),
    morgan = require('morgan'),
    errorhandler = require('errorhandler'),
    bodyparser = require('body-parser'),
    ServerConfig, ExtDirectConfig, environment, httpPort, httpsPort, store;

var app = express();

nconf.env().file({file: path.join(__dirname, 'server-config.json')});

environment = global.App.mode = process.env.NODE_ENV || 'development';

ServerConfig = nconf.get("ServerConfig-" + environment);
ExtDirectConfig = nconf.get("ExtDirectConfig-" + environment);

app.set('port', ServerConfig.port | 3000);
app.set('protocol', ServerConfig.protocol || 'http');

app.use(morgan(ServerConfig.logger));
app.use(errorhandler());
app.use(bodyparser());

if(ServerConfig.enableCompression){
    var compress = require('compression');

    app.use(compress());
}

if(ServerConfig.enableSessions){
    var cookieSession = require('cookie-session');

    if (environment === 'production')
        app.set('trust proxy', 1) // trust first proxy 
    
    app.use(cookieSession({
        keys: [ServerConfig.sessionSecret1, ServerConfig.sessionSecret2]
    }));
}

app.use(express.static(path.join(__dirname, ServerConfig.webRoot)));

//CORS Supports
if(ServerConfig.enableCORS){

    app.use( function(req, res, next) {
        res.header('Access-Control-Allow-Origin', ServerConfig.AccessControlAllowOrigin); // allowed hosts
        res.header('Access-Control-Allow-Methods', ServerConfig.AccessControlAllowMethods); // what methods should be allowed
        res.header('Access-Control-Allow-Headers', ServerConfig.AccessControlAllowHeaders); //specify headers
        res.header('Access-Control-Allow-Credentials', ServerConfig.AccessControlAllowCredentials); //include cookies as part of the request if set to true
        res.header('Access-Control-Max-Age', ServerConfig.AccessControlMaxAge); //prevents from requesting OPTIONS with every server-side call (value in seconds)

        if (req.method === 'OPTIONS') {
            res.send(204);
        }
        else {
            next();
        }
    });
}

//GET method returns API
app.get(ExtDirectConfig.apiPath, function(request, response) {
    try{
        var api = extdirect.getAPI(ExtDirectConfig);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(api);
    }catch(e){
        console.log(e);
    }
});

// Ignoring any GET requests on class path
app.get(ExtDirectConfig.classPath, function(request, response) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({success:false, msg:'Unsupported method. Use POST instead.'}));
});

// POST request process route and calls class
app.route(ExtDirectConfig.classPath)
    .post(function(request, response) {
        extdirect.processRoute(request, response, ExtDirectConfig);
    });

port = app.get('port');
protocol = app.get('protocol');

if (protocol === 'http') {
    http.createServer(app).listen(port, function(){
        console.log("Express server %s listening on port %d in %s mode", protocol, port, environment);
    });
} else {
    var options = {
      key: fs.readFileSync('/home/john/domains/djohnanderson.com/server.key'),
      cert: fs.readFileSync('/home/john/domains/djohnanderson.com/server.crt')
    };

    https.createServer(options, app).listen(port, function(){
        console.log("Express server %s listening on port %d in %s mode", protocol, port, environment);
    });
}
