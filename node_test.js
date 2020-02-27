var https = require('https');
var fs = require('fs');
var config = require('./config'); 
var router = require('./router');   

var options = {
    key: fs.readFileSync(config.config['keypath']),
    cert: fs.readFileSync(config.config['certpath'])
};

console.log("listening on port" + config.config['port'])
https.createServer(options, router.resolve).listen(8000);


