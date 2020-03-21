let url = require('url');
let qs = require('querystring');
let fs = require('fs');

bazadate=require( './node_test');
let utils = require('./router-utils');
let fetch = require('isomorphic-fetch'); // aduce fetchul si pe server. e nevoie pentru dropbox
let Dropbox = require('dropbox').Dropbox;

let staticResourceDropper = (route, res) => {
    let path = "./static" + route;
    while(!fs.existsSync(path)){
        var result = route.search("/");
        route=route.slice(result+1);
        result = route.search("/");
        route=route.slice(result);
        path="./static"+route;
        console.log("DECI:"+path);
    }
    
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
        
        if(requestInfo.urlQuery === null) return undefined;
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
            let userPromise = bazadate.getUserByUsername(router.getParam('username'));
            
            userPromise.then( (result) => {
                    utils.sendJson(200,res,result[0]);
                }
            );
        }
        else if(router.is('/allusers')) {
            let userPromise = bazadate.getAllUsers();

            userPromise.then( (result)=>{
                    utils.sendJson(200,res,result);
            });
        }
        else if(router.is("/auth")) {
            utils.sendTemplate(req, res, "templates/login_page.html", {}, 200);

        }
        else if(router.is("/auth/mama/tata")){
            utils.sendTemplate(req,res,"static/test.html",{},200);
        }
        else if(router.is("/auth/dropbox")) {
            // let redirectUri = "https://localhost:8000/auth/dropbox";
            // console.log("entered auth dropbox");
            // const config = {
            //     fetch: fetch,
            //     clientId: ["pz5akpcc0yc3mc3"],
            //     clientSecret: ["qer0wpi81ifx91v"]
            // };


            // let dbx = new Dropbox(config);
            // const authUrl = dbx.getAuthenticationUrl(redirectUri, null, 'code');
            
            // console.log("auth url", authUrl);

            // let code = router.getParam("access_token");
            // console.log(code);

            // var options = Object.assign({
            //     code,
            //     redirectUri
            // }, config);
            
            
            // dbx.getAccessTokenFromCode(redirectUri, code)
            //     .then(function(token) {
            //         console.log(token);
            //         utils.sendTemplate(req, res, "callback.html", {code:code}, 200);
            //     })
            //     .catch(function(error) {
            //         console.log(error);
            //         utils.redirect(res, "500.html");
            //     });
            
            let code = router.getParam("access_token");
            utils.sendTemplate(req, res, "callback.html", {code:code}, 200);
        }
        
        else if(router.is('/upload', "POST")) {
            utils.upload(requestBody, res);
        }

        // TODO de sters astea dupa ce se rezolva redirectul si static resource dropper
        else if(router.is("/auth/dropbox-sdk/Dropbox-sdk.min.js")) {
            res.writeHead(200)
            let content = fs.readFileSync("static/dropbox-sdk/Dropbox-sdk.min.js");
            res.end(content);
        }
        else if(router.is("/auth/utils.js")) {
            res.writeHead(200)
            let content = fs.readFileSync("static/Dropbox-sdk.min.js");
            res.end(content);
        }

        else {
            if(!staticResourceDropper(router.requestInfo.urlPathname, res)) {
               // utils.sendJson(404,res,router.requestInfo);
               utils.sendTemplate(req,res,"static/404.html",{},404);
            }
            else
            {console.log("DA"+router.requestInfo.urlPathname);}
        }

        //console.log(router.requestInfo);
    })
}

module.exports = {
    "resolve": resolver
} 