let url = require('url');
let qs = require('querystring');;
let stollib = require('./stol-main');
let db = require('./database');
let utils = require('./router-utils');
let google = require('./google-framework');
let dropbox = require('./dropbox-framework');
let onedrive = require('./onedrive-framework');
let statedb = require("./statedb");
let UserModel = require('./models/UserModel');
let FileModel = require("./models/FileModel");
let MetadataModel = require("./models/MetadataModel");


let bazadate = db.DataBase();
let UserDB =  UserModel.CreateUserModel(bazadate.db);
let FileDB = FileModel.CreateFileModel(bazadate.db);
let MetadataDB = MetadataModel.CreateMetadataModel(bazadate.db);

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

    req.on('end', async () => {
        console.log(requestBody);
        if (requestBody.includes("\n\r")) {
            requestBody = utils.parseBodyFormData(requestBody);
        }
        else {
            requestBody = qs.parse(requestBody);
        }
        console.log(requestBody);

        let router = routerObjectConstructor(req);
        
        if(router.is('/')) {
            utils.sendTemplate(req, res,"templates/welcome-pahe.html", {} , 200);
        }
        else if (router.is('/user')) {
            console.log(router.getParam('username'));
            let userPromise = UserDB.getUserByUsername(router.getParam('username'));
            userPromise.then( (result) => {
                    utils.sendJson(200,res,result);
                }
            );
        }
        else if (router.is('/mainScreen/mainpage')) {
            utils.sendTemplate(req, res, "templates/mainScreen.html", {}, 200);
        }
            
        else if (router.is('/userpage')) {
            utils.sendTemplate(req, res, "templates/user_page.html", {}, 200);
        }

        else if(router.is('/adminPage')){
            utils.sendTemplate(req, res, "templates/adminScreen.html", {}, 200);
        }
        else if(router.is('/userFiles')){
            utils.sendTemplate(req, res, "templates/user-files.html", {}, 200);
        }
        else if(router.is('/allusers')) {
            let userPromise = UserDB.getAllUsers();

            userPromise.then( (result)=>{
                    utils.sendJson(200, res, {data:result});
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
        else if(router.is('/getUserFiles')){
            const email = router.getParam("email");
            let userPromise = MetadataDB.getUserFiles(email)
            userPromise.then((result)=>{
                utils.sendJson(200,res,{data: result})
            }).catch(err=>console.log(err))
        }
        else if(router.is("/get-providers-for-files")) {
            // TODO chiar sa le ia din baza de date
            const fileNames = JSON.parse(req.headers["data"])["names"];
            console.log(fileNames);

            let providerNames = [];
            let providers = ["G", "D", "O"];
            let counter = 0;
            for(name of fileNames) {
                providerNames.push(providers[counter%providers.length]);
                counter++;
            }

            let raspuns = {
                "names": providerNames
            }
            utils.sendJson(200, res, raspuns);
        }
        else if (router.is('/welcomePage/onRegister',"POST")){
            const email=requestBody.email;
            const password=requestBody.password;
            const name=requestBody.name;
            const surname=requestBody.surname;
            console.log(requestBody);
            UserDB.getUserByEmail(email).then(
                (user)=>{
                    if(user[0]==undefined){
                        UserDB.insertUser(email, password, name, surname);
                        //res.writeHead(301,{"Location":"https://localhost:8000/oauth-redirect"});
                        //res.end();
                        utils.sendTemplate(req, res, "templates/mainScreen.html", { "email": email }, 200);
                        }
                        else{
                            res.writeHead(301,{"Location":"https://localhost:8000/"});
                            res.end();
                        }
                }
            );
        }
        else if(router.is('/sendMetadata',"POST")){
            const fileName=requestBody.fileName;
            const size=requestBody.size;
            const files=requestBody.files;
            const email=requestBody.email;
            MetadataDB.insertUserFile(fileName,size,files,email);

        }
        else if (router.is('/welcomePage/onLogin',"POST")){
            email=requestBody.email;
            password = requestBody.password;
            UserDB.getUserByEmail(email).then(
               (user)=>{
                   if(user[0] !== undefined && password === user[0].password){
                   // res.writeHead(301,{"Location":"https://localhost:8000/oauth-redirect"});
                    //res.end();
                    utils.sendTemplate(req, res, "templates/mainScreen.html", { "email": email }, 200);
                   }else{
                    
                    res.writeHead(301,{"Location":"https://localhost:8000/"});
                    res.end(); 
                   }
                    
                })
                .catch(err => console.log(err));
        }
        else if (router.is('/settings/changeSettings',"POST")){
            const email=requestBody.email;
            const name = requestBody.name;
            const surname = requestBody.surname;
            const oldpass = requestBody.oldpass;
            const pass = requestBody.pass;
            const mode = requestBody.mode;
            const First = requestBody.First;
            const Second = requestBody.Second;
            const Third = requestBody.Third;
        
            UserDB.updateProfile(email,name,surname,oldpass,pass,mode,First,Second,Third).then(
                (result)=>{
                    if(result==true){
                        utils.sendTemplate(req, res, "templates/settings-page.html", {"mesaj":"Succes!"}, 200);
                    }
                    else{
                        utils.sendTemplate(req, res, "templates/settings-page.html", {"mesaj":"Wrong old password"}, 200);
                    }
                }
            ).catch(
                (err)=>console.log(err)
            );
            
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
            let codeType = stollib.getCodeType(code);
            console.log(codeType);

            // this can be google/dropbox/onedrive module
            let workingObj = stollib.emptyWorkingObject;
            if(codeType == "O"){
                if(statedb.tokens["userid"]["grefreshtoken"] == undefined) {
                    workingObj = onedrive;
                }
                else {
                    codeType = "undefined";
                }
            }
            else if(codeType == "G") {
                if(statedb.tokens["userid"]["grefreshtoken"] == undefined) {
                    workingObj = google;
                }
                else {
                    codeType = "undefined";
                }
            }
            else if(statedb.tokens["userid"]["d"] == undefined) {
                workingObj = dropbox;
            }

            let promises = [];
            
            if(statedb.tokens["userid"]["grefreshtoken"]) {
                promises.push(google.refreshToken(statedb.tokens["userid"]["grefreshtoken"]));
            }
            if(statedb.tokens["userid"]["orefreshtoken"]) {
                promises.push(onedrive.refreshToken(statedb.tokens["userid"]["orefreshtoken"]));
            }
            // nu este nevoie de un lucru asemanator pentru dropbox deoarece se tokenul de acolo se poate folosi de mai multe ori

            Promise.all(promises).then((tokens) => {
                workingObj.accesscode(code).then((rez) =>  {
                    console.log("rezultat", rez);
                    utils.sendTemplate(req, res, "templates/mainScreen.html", { "g": tokens[0], "o": tokens[1], "d": statedb.tokens["userid"]["d"]}, 200);
                })
            }).catch((err) => {
                console.log(err);
                utils.sendTemplate(req, res, "templates/errors/error.html", {}, 500);
            })

            




        }
        else if(router.is("/settings")){
            utils.sendTemplate(req,res,"templates/settings-page.html",{},200);
        }

        else if(router.is("/getfileid")) {
            const email = router.getParam("email");
            const filename = router.getParam("filename");
            console.log(email, filename);
            const rezult = await FileDB.getFileId(email, filename);
            utils.sendJson(200, res, {
                "id": rezult[0]
            }); 
        }

        // VALIDARE AICI. in momentul asta se pot adauga la infinit fara problema
        else if(router.is("/insertfileid", "POST")) {
            const email = requestBody.email;
            const filename = requestBody.filename;
            const id = requestBody.id;
            console.log(email,filename, id);
            FileDB.insertFile(email, filename, id);
            res.writeHead(200);
            res.end();
        }
        else if(router.is("/getCSV","POST")){
            let email=requestBody.emails.split(',');
            console.log(email)
            MetadataDB.toCSV(email[0]).then(
                (csv) => {
                    console.log(csv);
                    utils.sendJson(200,res,{data:csv});
                }
            ).catch(
                (err)=>console.log(err)
            );
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