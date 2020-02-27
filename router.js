let url = require('url');
let qs = require('querystring');

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
        requestInfo.urlPathname = urlPathname; //sample value: /api/employee
        requestInfo.urlQuery = urlQuery; //sample value: {"id": "12345","name": "Kay"}
        requestInfo.body = qs.parse(requestBody); //sample value: {"firstname": "Clarkson","lastname": "Nick"}
        requestInfo.urlObject = urlObject;
 
        console.log(requestInfo);
        res.writeHead(200, {'Content-type':'application/json'});
        res.end(JSON.stringify(requestInfo));
    })
}

module.exports = {
    "resolve": resolver
}