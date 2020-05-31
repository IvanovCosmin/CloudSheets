let url = require('url');
let qs = require('querystring');

let stollib = require('./stol-main');


bazadate=require( './node_test');
let utils = require('./router-utils');
let google = require('./google-framework');
let dropbox = require('./dropbox-framework');
//let google = require('./google-framework');

let routerObjectConstructor = (req) => {
    let return_obj = {}
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
    requestInfo.parsedParams = {};
    
    if(requestInfo.urlQuery !== null) {
        let params = requestInfo.urlQuery.split("&");
        for(par of params) {
            let [key,value] = par.split('=');
            requestInfo.parsedParams[key] = value;
        }
    }

    return_obj = {
        is: (route, verb = "GET") => {
            return route === requestInfo.urlPathname && verb == requestInfo.method;
        },
        endswith: (string) => {
            return requestInfo.urlPathname.endsWith(string);
        },
        requestInfo: requestInfo,
        getParam: (param) => {return requestInfo.parsedParams[param]}
    }
    return return_obj;
}

let resolver = (req, res) => { 
    let requestBody = "";
    req.on('data', (data) => {
        requestBody += data;
    })

    req.on('end', () => {
        console.log(requestBody);
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
            console.log(router.getParam('username'));
            let userPromise = bazadate.getUserByUsername(router.getParam('username'));
            
            userPromise.then( (result) => {
                    utils.sendJson(200,res,result[0]);
                }
            );
        }
        else if (router.is('/userpage')) {
            utils.sendTemplate(req, res, "templates/user_page.html", {}, 200);
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
            utils.sendTemplate(req, res, "callback.html", {}, 200);
        }
        
        else if(router.is('/upload', "POST")) {
            // nu tin minte ce i cu asta. got help. probabil trb sa dispara
            utils.upload(requestBody, res);
        }

        else if(router.is("/get-files")) {
            utils.sendTemplate(req, res, "templates/get-files.html", {}, 200);
        } 
        
        else if(router.is("/glt")) {
            utils.redirect(res, google.login_link());
        }

        else if(router.is("/dlt")) {
            utils.redirect(res, dropbox.login_link());
        }

        else if(router.is("/oauth-redirect")) {
            const code = decodeURIComponent(router.getParam('code'));
            console.log(code);
            const codeType = stollib.getCodeType(code);

            // this could be google/dropbox/onedrive module
            let workingObj = undefined;

            if(codeType == "G") {
                workingObj = google;
            }
            else {
                workingObj = dropbox;
            }

            workingObj.accesscode(code).then((rez) =>  {
                console.log("rezultat", rez);
                utils.sendTemplate(req, res, "templates/upload-g-test.html", { "code": rez }, 200);
            }).catch((err) => {
                console.log(err);
                utils.sendTemplate(req, res, "templates/errors/error.html", {}, 500);
            });

        }

        

        else if(router.endswith(".wasm")) {
            if(!utils.wasmResourceDropper(router.requestInfo.urlPathname, res)) {
                utils.sendTemplate(req,res,"static/404.html",{},404);
            }
        }

        else {
            if(!utils.staticResourceDropper(router.requestInfo.urlPathname, res)) {
               // utils.sendJson(404,res,router.requestInfo);
               utils.sendTemplate(req,res,"static/404.html",{},404);
            }
        }
    })
}

module.exports = {
    "resolve": resolver
} 