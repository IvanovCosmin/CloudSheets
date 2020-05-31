let url = require('url');
let qs = require('querystring');
let fs = require('fs');

bazadate=require( './index');
let utils = require('./router-utils');
let fetch = require('isomorphic-fetch'); // aduce fetchul si pe server. e nevoie pentru dropbox
let Dropbox = require('dropbox').Dropbox;



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
        requestBody = qs.parse(requestBody);
        let router = routerObjectConstructor(req);
        
        // TODO cautat varianta mai buna ca router.is
        if(router.is('/')) {
            let testContext = {
                "gheiString": "Paul ultra ghei", 
                "orNot" : "E doar o gluma ca sa demonstrez templateurile :)"
            };
            utils.sendTemplate(req, res,"static/welcomePage/index.html", testContext, 200);
        }
        else if (router.is('/user')) {
            let userPromise = bazadate.getUserByUsername(router.getParam('username'));
            userPromise.then( (result) => {
                    utils.sendJson(200,res,result);
                }
            );
        }
        else if (router.is('/mainScreen/mainpage')) {
            utils.sendTemplate(req, res, "static/mainScreen/index.html", {}, 200);
            
        }
        else if(router.is('/allusers')) {
            let userPromise = bazadate.getAllUsers();

            userPromise.then( (result)=>{
                    utils.sendJson(200,res,result);
            });
        }else if(router.is('/dropDB')) {
            bazadate.dropTable();
            res.writeHead(301);
            res.end();
        }else if(router.is('/createDB')) {
            bazadate.createTable();
            res.writeHead(301);
            res.end();
        }
        else if(router.is("/auth")) {
            utils.sendTemplate(req, res, "templates/login_page.html", {}, 200);

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
        else if (router.is('/onedriveAPI/upload','PUT')){
            
           // const obj = JSON.parse(requestBody);
           console.log(requestBody);
            email = router.getParam('email');
            file_name = router.getParam('file');
            file_id = router.getParam('id');
            bazadate.insertOnedriveFile(email,file_name,file_id);
            res.writeHead(301);
            res.end();
        }
        else if(router.is('/onedriveAPI/all','GET')){
            bazadate.getAllOnedriveFiles().then( (result)=>{
                utils.sendJson(200,res,result);
        });
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
        else if(router.is("/static/onedrive/onedrive")){
            utils.sendTemplate(req,res,"static/onedrive/test.html",{},200);
        }
        else if(router.is("/static/onedrive-upload/")){
            utils.sendTemplate(req,res,"static/onedrive-upload/onedrive-upload.html",{},200);
        }
        else if(router.is("/auth/utils.js")) {
            res.writeHead(200)
            let content = fs.readFileSync("static/Dropbox-sdk.min.js");
            res.end(content);
        }
        
        else {
            if(!utils.staticResourceDropper(router.requestInfo.urlPathname, res)) {
               // utils.sendJson(404,res,router.requestInfo);
               utils.sendTemplate(req,res,"static/404.html",{},404);
            }
            else
            {console.log(router.requestInfo.urlPathname);}
        }

        //console.log(router.requestInfo);
    })
}

module.exports = {
    "resolve": resolver
} 