let url = require('url');
let qs = require('querystring');;
let stollib = require('./stol-main');
let db = require('./database');
let utils = require('./router-utils');
let google = require('./google-framework');
let dropbox = require('./dropbox-framework');
let onedrive = require('./onedrive-framework');

let bazadate = db.DataBase();

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
        
        if(router.is('/')) {
            let testContext = {
                "gheiString": "Paul ultra ghei", 
                "orNot" : "E doar o gluma ca sa demonstrez templateurile :)"
            };
            utils.sendTemplate(req, res,"static/welcomePage/index.html", testContext, 200);
        }
        else if (router.is('/user')) {
            console.log(router.getParam('username'));
            let userPromise = bazadate.getUserByUsername(router.getParam('username'));
            userPromise.then( (result) => {
                    utils.sendJson(200,res,result);
                }
            );
        }
        else if (router.is('/mainScreen/mainpage')) {
            utils.sendTemplate(req, res, "static/mainScreen/index.html", {}, 200);
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
        else if(router.is('/dropDB')) {
            bazadate.dropTable(); // sigur e o idee incredibila. sa ii facem si documentatie?
        }
        else if(router.is('/createDB')) {
            bazadate.createTable();
        }
        else if(router.is("/text-input/homepage")){
            utils.sendTemplate(req,res,"static/text-input/text-input.html",{},200);
        }
        else if(router.is("/text-input/login")){
            utils.sendTemplate(req,res,"static/text-input/login.html",{},200);
        }
        else if (router.is('/welcomePage/onRegister',"POST")){
            email=requestBody.email;
            password=requestBody.password;
            name=requestBody.name;
            surname=requestBody.surname;
            bazadate.getUserByEmail(email).then(
                (user)=>{
                    if(user[0]==undefined){
                        bazadate.insertUser(email, password, name, surname);
                        res.writeHead(301,{"Location":"https://localhost:8000/text-input/login"});
                        res.end();
                        }
                        else{
                            res.writeHead(301,{"Location":"https://localhost:8000/"});
                            res.end();
                        }
                }
            );
        }
        else if (router.is('/welcomePage/onLogin',"POST")){
            email=requestBody.email;
            password = requestBody.password;
             bazadate.getUserByEmail(email).then(
               (user)=>{
                   if(user[0] !== undefined && password === user[0].password){
                    res.writeHead(301,{"Location":"https://localhost:8000/mainScreen/mainpage"});
                    res.end();
                   }else{
                    
                    res.writeHead(301,{"Location":"https://localhost:8000/"});
                    res.end(); 
                   }
                    
                });
        }

        else if(router.is('/upload', "POST")) {
            // nu tin minte ce i cu asta. got help. probabil trb sa dispara
            utils.upload(requestBody, res);
        }

        else if(router.is("/get-files")) {
            utils.sendTemplate(req, res, "templates/get-files.html", {}, 200);
        } 
        else if(router.is("/olt")) {
            utils.redirect(res,onedrive.login_link());
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
            console.log(code.length);
            const codeType = stollib.getCodeType(code);
            console.log(codeType);
            // this could be google/dropbox/onedrive module
            let workingObj = undefined;
            if(codeType == "O"){
                workingObj = onedrive;
            }
            else if(codeType == "G") {
                workingObj = google;
            }
            else {
                workingObj = dropbox;
            }

            workingObj.accesscode(code).then((rez) =>  {
                console.log("rezultat", rez);
                utils.sendTemplate(req, res, "templates/mainScreen.html", { "codeType": codeType, "code": rez }, 200);
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

        else if(router.endswith(".svg")) {
            if(!utils.svgResourceDropper(router.requestInfo.urlPathname, res)) {
                utils.sendTemplate(req,res,"static/404.html", {}, 404);
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

process.on('SIGINT', () => {
    bazadate.closeDatabase();
});

module.exports = {
    "resolve": resolver,
    "database": bazadate
} 