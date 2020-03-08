let https = require('http2');
let fs = require('fs');
let config = require('./config'); 
let router = require('./router');   
let oauth2orize = require('oauth2orize');

let oauthServer = oauth2orize.createServer();


let options = {
    key: fs.readFileSync(config['keypath']),
    cert: fs.readFileSync(config['certpath'])
};


  server = https.createSecureServer(options, router.resolve);
  server.on('session', (session) => {
      session.on('connect', (socket) => {
          // console.log(session);
          // console.log(socket);
          console.log("a client has connected");
        });
    });
    
    
    server.listen(config['port']);
    console.log("listening on port " + config['port']);
    

