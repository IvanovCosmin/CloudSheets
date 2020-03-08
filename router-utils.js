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
    res.write(JSON.stringify(data,null,2));
    res.end();   
}

let redirect = (res, url) => {    
    //weird bug in simple-oauth2 doesnt understand that i am using oauth2 not oauth
    //TODO dat replace doar la oauthul din https://www.dropbox.com/oauth in functie separata
    url = url.replace("oauth", "oauth2");
    console.log(url);
    res.writeHead(302, {
        'Location': url
        });
    res.end();  
}

let temporaryRedirect = (headers, url) => {    
    //weird bug in simple-oauth2 doesnt understand that i am using oauth2 not oauth
    //TODO dat replace doar la oauthul din https://www.dropbox.com/oauth in functie separata
    console.log("redirected", url);
    res.writeHead(307, headers);
    res.end();  
} 

let uploadDropbox = (req, res) => {
    // curl -X POST https://content.dropboxapi.com/2/files/upload \
    // --header "Authorization: Bearer BQOYyAxkcAkAAAAAAAAPvY3KUT0axICwT-M_5TFlIG5Fx-5W1DveR7sovtysqt4M" \
    // --header "Dropbox-API-Arg: {\"path\": \"/Homework/math/Matrices.txt\",\"mode\": \"add\",\"autorename\": true,\"mute\": false,\"strict_conflict\": false}" \
    // --header "Content-Type: application/octet-stream" \
    // --data-binary @local_file.txt
    res.writeHead(200);
    temporaryRedirect()
    res.end();
}

module.exports = {
    "sendTemplate" : sendTemplate,
    "sendJson" : sendJson,
    "redirect": redirect,
    "upload": uploadDropbox
};