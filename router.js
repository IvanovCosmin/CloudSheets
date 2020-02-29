let url = require('url');
let qs = require('querystring');
let fs = require('fs');
let db = require('./db_scripts');
let utils = require('./router-utils');
let staticResourceDropper = (route, res) => {
    let path = "./static" + route;
    if(fs.existsSync(path)) {
        res.writeHead(200)
        let content = fs.readFileSync(path);
        res.end(content);
        return true;
    }
    return false;
} 

let routerObjectConstructor = (req) => {
    console.log("req.url", req.url);
    if(req.url === undefined) return {
        is: (route, verb = "GET") => false
    }
    let urlObject = url.parse(req.url);
    let urlQuery = urlObject.query;
    let urlPathname = urlObject.pathname;
    requestInfo = {};
    requestInfo.urlPathname = urlPathname;
    requestInfo.urlQuery = urlQuery; 
    requestInfo.urlObject = urlObject;
    requestInfo.method = req.method;
    
    // poate e putin ineficienta abordarea asta
    // dar memorie--, viteza++
    const getParam = (object, param) => {
        if(object.__parsedParams !== undefined) {
            if(param in object.__parsedParams) {
                return object.__parsedParams[param];
            }
            else{
                return undefined;
            }
        }
        object.__parsedParams = {};
        let params = requestInfo.urlQuery.split("&");
        for(par of params) {
            let [key,value] = par.split('=');
            console.log("obj",object.__parsedParams);
            console.log(key);
            console.log(value);
            console.log(par);
            object.__parsedParams[key] = value;
        }
        return getParam(object, param);
    }

    return {
            __parsedParams: undefined,
            is: (route, verb = "GET") => {
                return route === requestInfo.urlPathname && verb == requestInfo.method;
            },
            requestInfo: requestInfo,
            getParam: (param) => {return getParam(this, param)}
        }
}

let resolver = (req, res) => { 
    let requestBody = "";
    req.on('data', (data) => {
        requestBody += data;
    })

    req.on('end', () => {
        requestBody = qs.parse(requestBody);
        let router = routerObjectConstructor(req);
        
        // TODO cautat varianta mai buna ca router.is
        if(router.is('/')) {
            let testContext = {
                "gheiString": "Paul ultra ghei", 
                "orNot" : "E doar o gluma ca sa demonstrez templateurile :)"
            };
            utils.sendTemplate(req, res,"index.html", testContext, 200);
        }
        else if (router.is('/user')) {
            let userPromise = db.getUserByUsername(router.getParam('username'));
            
            userPromise.then( (result) => {
                    utils.sendJson(200,res,result[0]);
                }
            );
        }

        else {
            if(!staticResourceDropper(router.requestInfo.urlPathname, res)) {
                utils.sendJson(404,res,router.requestInfo);
            }
        }

        //console.log(router.requestInfo);
    })
}

module.exports = {
    "resolve": resolver
}