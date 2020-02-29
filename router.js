let url = require('url');
let qs = require('querystring');
let fs = require('fs');
let db = require('./db_scripts');


let routerObjectConstructor = (req) => {
    console.log("req.url", req.url);
    if(req.url === undefined) return {
        is: (route) => false
    }
    let urlObject = url.parse(req.url);
    let urlQuery = urlObject.query;
    let urlPathname = urlObject.pathname;
    requestInfo = {};
    requestInfo.urlPathname = urlPathname;
    requestInfo.urlQuery = urlQuery; 
    requestInfo.urlObject = urlObject;
    
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
            is: (route) => {
                return route === requestInfo.urlPathname;
            },
            requestInfo: requestInfo,
            getParam: (param) => {return getParam(this, param)}
        }
}



// the function that parses the template
let prepareServita = (templateBody, context) => {
    // TODO sa se faca tempalteuri care sa poata si evalua anumite expresii sau un for :P
    // TODO mutat cod servite in alt fisier
    let parsedResult = String(templateBody);
    let objectFindRegEx = /\{\{(?<objdata>.*?)\}\}/g; // this regex finds words inside {{ }}

    searchResult = objectFindRegEx.exec(parsedResult);
    
    if(searchResult == null) { // there is nothing more to be replaced
        return parsedResult;
    }

    parsedResult = parsedResult.replace(searchResult[0], context[searchResult[1].trim()]);
    return prepareServita(parsedResult, context);

}

// context represents a object that contains the variables that will be
// used in the template
let sendTemplate = (req, res, path, context, statusCode) => {
    res.writeHead(statusCode, {'Content-type': 'text/html'})
    let content = fs.readFileSync(path);
    
    res.end(prepareServita(content, context));
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
            sendTemplate(req, res,"index.html", testContext, 200);
        }
        else if (router.is('/user')) {
            let userPromise = db.getUserByUsername(router.getParam('username'));
            
            userPromise.then( (result) => {
                    // TODO facut functie pentru trimis jsoane asemenea sendTemplate
                    res.writeHead(200, {'Content-type':'application/json'});
                    res.end(JSON.stringify(result[0]));
                }
            );
        }
        else {
            res.writeHead(200, {'Content-type':'application/json'});
            res.end(JSON.stringify(router.requestInfo));
        }

        //console.log(router.requestInfo);
    })
}

module.exports = {
    "resolve": resolver
}