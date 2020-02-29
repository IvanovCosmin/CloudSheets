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

let sendJson = (statusCode,res,data) =>  {
    res.writeHead(statusCode, {'Content-type':'application/json'});
    res.end(JSON.stringify(data));   
}

module.exports = {
    "sendTemplate" : sendTemplate,
    "sendJson" : sendJson
};