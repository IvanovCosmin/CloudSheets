let url = require('url');
let qs = require('querystring');
let fs = require('fs');


// the function that parses the template
let prepareServita = (templateBody, context) => {
    // TODO sa se faca tempalteuri care sa poata si evalua anumite expresii sau un for :P
    
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
        let testContext = {
            "gheiString": "Paul ultra ghei", 
            "orNot" : "E doar o gluma ca sa demonstrez templateurile :)"
        };
        if(requestInfo.urlPathname == '/') {
            sendTemplate(req, res,"index.html", testContext, 200);
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