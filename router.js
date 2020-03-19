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
        console.log(object.__parsedParams);
        
        let params = requestInfo.urlQuery.split("&");
        for(par of params) {
            let [key,value] = par.split('=');
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
        else if(router.is('/allusers')) {
            let userPromise = db.getAllUsers();

            userPromise.then( (result)=>{
                    utils.sendJson(200,res,result);
            });
        }
        else if(router.is('/get-client-secret')) {
            const credentials = {
                client: {
                  id: 'pz5akpcc0yc3mc3',
                  secret: 'qer0wpi81ifx91v'
                },
                auth: {
                  tokenHost: 'https://www.dropbox.com/oauth2/authorize'
                }
              };
            const oauth2 = require('simple-oauth2').create(credentials);
            const tokenConfig = {
                code: router.getParam("code"),
                redirect_uri: 'http://localhost:8000/callback',
                scope: '<scope>',
              };
             
              try {
                console.log("test");
                oauth2.authorizationCode.getToken(tokenConfig).then(
                    (result) => {
                        console.log("test");
                        console.log(result);
                        const accessToken = oauth2.accessToken.create(result);
                        console.log(accessToken);
                    }
                ).catch((error) => console.log("error"));
        
              } catch (error) {
                console.log('Access Token Error', error.message);
              }
        }
        else if (router.is("/callback")){
            utils.sendTemplate(req, res,"callback.html",
            {
                "code": router.getParam("code")
            },
            200);
        }

        else if(router.is('/oauth')) {
            async function run() {
                const credentials = {
                    client: {
                      id: 'pz5akpcc0yc3mc3',
                      secret: 'qer0wpi81ifx91v'
                    },
                    auth: {
                      tokenHost: 'https://www.dropbox.com/oauth2/authorize'
                    }
                  };
                const oauth2 = require('simple-oauth2').create(credentials);
               
                const authorizationUri = oauth2.authorizationCode.authorizeURL({
                  redirect_uri: 'https://localhost:8000/get-client-secret',
                  scope: '',
                  state: '<state>'
                });
               
                utils.redirect(res, authorizationUri);
              }

            run();
        }
        else if(router.is('/upload', "POST")) {
            utils.upload(requestBody, res);
        }

        else {
            if(!staticResourceDropper(router.requestInfo.urlPathname, res)) {
               // utils.sendJson(404,res,router.requestInfo);
               utils.sendTemplate(req,res,"static/404.html",{},404);
            }
        }

        //console.log(router.requestInfo);
    })
}

module.exports = {
    "resolve": resolver
}