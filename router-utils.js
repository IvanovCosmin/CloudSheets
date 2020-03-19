let fs = require('fs');

let macacpeviata = () =>
{
    var output = "";
    var options = "1234567890FABCDEF";
    for(i = 0; i < 40; i++) {
        output += options[Math.floor(Math.random() * 100000) % options.length];
    }   
    return output;
}

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
    res.writeHead(statusCode, {'Content-type': 'text/html',"Cache-Control": "no-cache", "Last-Modified": new Date(), "ETag": macacpeviata(),"max-age":"1" })
    let content = fs.readFileSync(path);
    
    res.end(prepareServita(content, context));
}

let sendJson = (statusCode,res,data) =>  {
    res.writeHead(statusCode, {'Content-type':'application/json'});
    res.write(JSON.stringify(data,null,2));
    res.end();   
}

let redirect = (res, url) => {    
    //weird bug in simple-oauth2 doesnt understand that i am using oauth2 not oauth
    //TODO dat replace doar la oauthul din https://www.dropbox.com/oauth in functie separata
    
    // libraria vietii simple-oauth2 nu este in stare sa te lase sa setezi pathul.
    // pentru ca nu puteam folosi nimic
    // pana la urma imi iau inima in dinti si o sa scriu eu ce trebuie.
    //url = url.replace("oauth", "oauth2");
    console.log(url);
    res.writeHead(302, {
        'Location': url
        });
    res.end();  
}

module.exports = {
    "sendTemplate" : sendTemplate,
    "sendJson" : sendJson,
    "redirect": redirect,
};