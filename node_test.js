var https = require('https');
var fs = require('fs');
var config = require('./config'); 
var router = require('./router');   

var options = {
    key: fs.readFileSync(config['keypath']),
    cert: fs.readFileSync(config['certpath'])
};

console.log("listening on port" + config['port'])
https.createServer(options, router.resolve).listen(config['port']);


