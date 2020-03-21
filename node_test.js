let https = require('http2');
let fs = require('fs');
let config = require('./config'); 
let router = require('./router');   
let oauth2orize = require('oauth2orize');
let db=require('./database');
let oauthServer = oauth2orize.createServer();


let options = {
    key: fs.readFileSync(config['keypath']),
    cert: fs.readFileSync(config['certpath'])
};

server = https.createSecureServer(options, router.resolve);
bazadate= db.DataBase();
server.on('session', (session) => {
    session.on('connect', (socket) => {
        // console.log(session);
        // console.Slog(socket);
        console.log("a client has connected");
    });
    

});

server.listen(config['port']);
console.log("listening on port " + config['port']);

process.on('SIGINT', () => {
    bazadate.closeDatabase()
});


module.exports={
    bazadate
};