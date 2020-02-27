let url = require('url');
let qs = require('querystring');
let fs = require('fs');

let sendTemplate = (req, res, path, statusCode) => {
    res.writeHead(statusCode, {'Content-type': 'text/html'})
    let content = fs.readFileSync(path);
    res.end(content)
    // TODO fa chiar ca templateurile sa fie templateuri
}


let resolver = (req, res) => { 
    let urlObject = url.parse(req.url);
    let urlQuery = urlObject.query;
    let urlPathname = urlObject.pathname;

    let requestBody = "";
    let requestInfo = {};

    req.on('data', (data) => {
        requestBody += data;
    })

    req.on('end', () => {
        requestInfo.urlPathname = urlPathname;
        requestInfo.urlQuery = urlQuery; 
        requestInfo.body = qs.parse(requestBody);
        requestInfo.urlObject = urlObject;
        // TODO facut functie separata pentru popularea requestInfo

        if(requestInfo.urlPathname == '/') {
            sendTemplate(req, res, "index.html", 200);
        }
        else {
            res.writeHead(200, {'Content-type':'application/json'});
            res.end(JSON.stringify(requestInfo));
        }

        console.log(requestInfo);
    })
}

module.exports = {
    "resolve": resolver
}