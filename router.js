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



function LoggedInState(){
    var obj={
        users:{},
        addUser :function(token,email,name,surname){
            this.users[token]={email:email,name:name,surname:surname};
            console.log(token+" "+JSON.stringify(this.users[token]));
        },
        removeUser :function(token){
            delete this.users[token];
        },
        findUser :function(token){
            console.log(token+" "+JSON.stringify(this.users[token]));
            return this.users[token];
        }
    }

    return obj;
}
let loggedInUsers = new LoggedInState();

let routerObjectConstructor = (req) => {
    let return_obj = {};
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
    
    // split parametri url
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
        getParam: (param) => {return requestInfo.parsedParams[param]},
    }
    return return_obj;
}


let resolver = (req, res) => { 
    let requestBody = "";
    req.on('data', (data) => {
        requestBody += data;
    })

    req.on('end', async () => {
        if (requestBody.includes("\n\r")) {
            requestBody = utils.parseBodyFormData(requestBody);
        }
        else {
            requestBody = qs.parse(requestBody);
        }
        console.log(requestBody);

        let router = routerObjectConstructor(req);
        
        if(router.is('/')) {
            if(req.headers.cookie !== undefined){
                const token = req.headers.cookie.split("=")[1];
                if(loggedInUsers.findUser(token) != undefined){
                    if(loggedInUsers.findUser(token).email=="admin.admin@admins.com"){
                        utils.sendTemplate(req, res, "templates/adminScreen.html", {}, 200);    
                    }
                    else {
                        utils.redirect(res, "/oauth-redirect");
                    }
                }
                else{
                    utils.sendTemplate(req, res,"templates/welcome-page.html", {}, 200);
                }
            }
            else {
                utils.sendTemplate(req, res,"templates/welcome-page.html", {}, 200);
            }
            
        }
        else if (router.is('/user')) {
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token) != undefined){
                let userPromise = UserDB.getUserByUsername(router.getParam('username'));
                userPromise.then( (result) => {
                        utils.sendJson(200,res,result);
                    }
                );
            }
            else
            {
                utils.sendJson(401,res,{"error":"You are not logged in"});
            }
        }
        else if (router.is('/mainScreen/mainpage')) 
        {
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token) != undefined){
                utils.sendTemplate(req, res, "templates/mainScreen.html", {}, 200);
            }
            else{
                utils.sendTemplate(req, res,"templates/welcome-page.html", {}, 200);
            }
        }
            
        else if (router.is('/userpage')) {
            
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token)!=undefined){
                utils.sendTemplate(req, res, "templates/user_page.html", {}, 200);
            }
            else{
                utils.sendTemplate(req, res,"templates/welcome-page.html", {}, 200);
            }
            
        }

        else if(router.is('/adminPage')){
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token) != undefined){
                if(loggedInUsers.findUser(token).email=="admin.admin@admins.com"){
                    utils.sendTemplate(req, res, "templates/adminScreen.html", {}, 200);
                }
                else{
                    utils.sendTemplate(req, res,"templates/mainScreen.html", {}, 200);    
                }
            }
            else{
                utils.sendTemplate(req, res,"templates/welcome-page.html", {}, 200);
            }
            
        }
        else if(router.is('/userFiles')){

            const token = req.headers.cookie.split("=")[1];
            const user = loggedInUsers.findUser(token);
            if(user != undefined){
                utils.sendTemplate(req, res, "templates/user-files.html", { 
                    "email": email ,
                    "name": user.name + " " + user.surname,
                    "smallname":  user.name[0] + user.surname[0]
                }, 200 , token);
                
            }
            else{
                utils.sendTemplate(req, res,"templates/welcome-page.html", {}, 200);
            }
        }

        else if(router.is('/documentation')){
            utils.sendTemplate(req, res, "templates/documentation.html", {}, 200);
        }
        else if(router.is('/userGuide')){
            utils.sendTemplate(req, res, "templates/user-guide.html", {}, 200);
        }
        else if(router.is('/allusers')) {
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token) != undefined){
                let userPromise = UserDB.getAllUsers();

                userPromise.then( (result)=>{
                        utils.sendJson(200, res, {data:result});
                });
            }
            else{
                utils.sendJson(401,res,{"error":"You are not logged in"});
            }
        }
        else if(router.is('/getUserFiles')){
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token) != undefined){
                const email = router.getParam("email");
                let userPromise = MetadataDB.getUserFiles(email)
                userPromise.then((result)=>{
                    utils.sendJson(200,res,{data: result})
                }).catch(err=>console.log(err));
            }
            else{
                utils.sendJson(401,res,{"error":"You are not logged in"});
            }
        }
        else if(router.is("/get-providers-for-files")) {
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token) != undefined){
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
            }else{
                utils.sendJson(401,res,{"error":"You are not logged in"});
            }
        }
        else if (router.is('/welcomePage/onRegister',"POST")){
            const email=requestBody.email;
            const password=requestBody.password;
            const name=requestBody.name;
            const surname=requestBody.surname;
            if(utils.validateInput(email+password+name+surname)==true){
                UserDB.getUserByEmail(email).then(
                    (user)=>{
                        if(user[0]==undefined){
                            UserDB.insertUser(email, password, name, surname);
                            const token = utils.randomString();
                            loggedInUsers.addUser(token,email,name,surname);
                            if(email=="admin.admin@admins.com"){
                                utils.sendTemplate(req, res, "templates/adminScreen.html", { "email": email  }, 200 , token);
                            }else{
                                utils.sendTemplate(req, res, "templates/user-files.html", { 
                                    "email": email ,
                                    "name": name + " " + surname,
                                    "smallname":  name[0] + surname[0]
                                }, 200 , token);
                            }
                            }
                            else{
                                res.writeHead(301,{"Location":"https://localhost:8000/"});
                                res.end();
                            }
                    }
                ).catch((err) => {
                    console.log(err);
                });
            }
            else{
                res.writeHead(301,{"Location":"https://localhost:8000/"});
                res.end();
            }
            
        }
        else if(router.is('/sendMetadata',"POST")){
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token) != undefined){
                const fileName=requestBody.fileName;
                const size=requestBody.size;
                const files=requestBody.files;
                const email=requestBody.email;
                MetadataDB.insertUserFile(fileName,size,files,email);
            }
            else{
                utils.sendJson(401,res,{"error":"You are not logged in"});
            }
        }
        else if (router.is('/welcomePage/onLogin',"POST")){
            email=requestBody.email;
            password = requestBody.password;
            if(utils.validateInput(email+password) == true){
                UserDB.getUserByEmail(email).then(
                    (user)=>{
                        console.log(JSON.stringify(user[0]));
                        if(user[0] !== undefined && password === user[0].password){
                        // res.writeHead(301,{"Location":"https://localhost:8000/oauth-redirect"});
                         //res.end();
                         const token = utils.randomString();
                         loggedInUsers.addUser(token,user[0].email,user[0].name,user[0].surname);
                         if(user[0].email=="admin.admin@admins.com"){
                             utils.sendTemplate(req, res, "templates/adminScreen.html", { "email": email }, 200 , token);
                         }else{
                             utils.sendTemplate(req, res, "templates/user-files.html", { 
                                 "email": email ,
                                 "name": user[0].name + " " + user[0].surname,
                                 "smallname":  user[0].name[0] + user[0].surname[0]
                             }, 200 , token);
                         }
                         
                        }else{
                         
                         res.writeHead(301,{"Location":"https://localhost:8000/"});
                         res.end(); 
                        }
                         
                     })
                     .catch(err => console.log(err));
            }
            else{
                res.writeHead(301,{"Location":"https://localhost:8000/"});
                res.end();
            }
            
        }
        else if (router.is('/settings/changeSettings',"POST")){
            const email=requestBody.email;
            const name = requestBody.name;
            const surname = requestBody.surname;
            const oldpass = requestBody.oldpass;
            const pass = requestBody.pass;
            const mode = requestBody.mode;
            const token = req.headers.cookie.split("=")[1];
            const user = loggedInUsers.findUser(token);
            if(utils.validateInput(email+name+surname+oldpass+pass) == true){
                if(user != undefined) {
                    UserDB.updateProfile(email,name,surname,oldpass,pass,mode).then(
                        (result)=>{
                            if(result==true){
                                if(name != ""){
                                    user["name"]=name;
                                }
                                if(surname != ""){
                                    user["surname"]=surname;
                                }
                                utils.sendTemplate(req,res,"templates/settings-page.html",{
                                    "mesaj": "Succes!",
                                    "name": (user["name"] + " " + user["surname"]),
                                    "smallname": (user["name"][0] + user["surname"][0]),
                                    
                                }, 200);
                            }
                            else{
                                utils.sendTemplate(req,res,"templates/settings-page.html",{
                                    "mesaj": "Wrong passowrd",
                                    "name": (user["name"] + " " + user["surname"]),
                                    "smallname": (user["name"][0] + user["surname"][0]),
                                    
                                }, 200);
                            }
                        }
                    ).catch(
                        (err)=>console.log(err)
                    );
                }
                else{
                    utils.redirect(res, "/");
                }
            }
            else{
                utils.sendTemplate(req,res,"templates/settings-page.html",{
                    "mesaj": "Au fost introduse caractere invalide cum ar fi:< , > , ; , '",
                    "name": (user["name"] + " " + user["surname"]),
                    "smallname": (user["name"][0] + user["surname"][0]),
                    
                }, 200); 
            }
            
            
        } 
        else if(router.is("/olt")) {
            
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token)!=undefined){
                utils.redirect(res,onedrive.login_link());
            }
            else{
                utils.sendJson(401,res,{"error":"You are not logged in"});
            }
            
        }
        else if(router.is("/glt")) {
            
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token)!=undefined){
                utils.redirect(res, google.login_link());
            }
            else{
                utils.sendJson(401,res,{"error":"You are not logged in"});
            }
            
        }

        else if(router.is("/dlt")) {
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token)!=undefined){
                utils.redirect(res, dropbox.login_link());
            }
            else{
                utils.sendJson(401,res,{"error":"You are not logged in"});
            }
            
        }

        else if(router.is("/oauth-redirect")) {
            const token = req.headers.cookie.split("=")[1];
            const user = loggedInUsers.findUser(token);
            if(user !== undefined){
                const code = decodeURIComponent(router.getParam('code'));
                console.log(user);
                console.log(code);
                console.log(code.length);
                let codeType = stollib.getCodeType(code);
                console.log(codeType);
                console.log(user);
                if(statedb[token] === undefined) {
                    await statedb.initStatedDb(user["email"], token, UserDB);
                }

                console.log(statedb.tokens)

                // this can be google/dropbox/onedrive module
                let workingObj = stollib.emptyWorkingObject;
                if(codeType == "O"){
                    workingObj = onedrive;
                }
                else if(codeType == "G") {
                    if(statedb.tokens[token]["grefreshtoken"] == null) {
                        workingObj = google;
                    }
                    else {
                        codeType = "empty";
                    }
                }
                else if(codeType == "D") {
                    if(statedb.tokens[token]["d"] == null) {
                        workingObj = dropbox;
                    }
                    else {
                        codeType = "empty"
                    }
                }
                

                let promises = [];
                
                if(statedb.tokens[token]["grefreshtoken"]) {
                    promises.push(google.refreshToken(statedb.tokens[token]["grefreshtoken"]));
                }
                else {
                    promises.push(new Promise((resolve, reject) => {
                        resolve(undefined); // asta e aici pentru ca functia de mai jos se asteapta sa primeasca tot timpul al doilea element de la onedrive
                    }))
                }
                if(statedb.tokens[token]["orefreshtoken"]) {
                    promises.push(onedrive.refreshToken(statedb.tokens[token]["orefreshtoken"]));
                }
                // nu este nevoie de un lucru asemanator pentru dropbox deoarece tokenul de acolo se poate folosi de mai multe ori

                Promise.all(promises).then((rtokens) => {
                    workingObj.accesscode(code).then((rez) =>  {
                        console.log(rez);
                        console.log("intru in if")
                        if(codeType == "O") {
                            statedb.tokens[token]["orefreshtoken"] = rez["refresh_token"];
                            UserDB.addOnedriveRefreshToken(user["email"], rez["refresh_token"]);
                            utils.redirect(res, "/oauth-redirect");
                        }
                        if(codeType == "G" && statedb.tokens[token]["grefreshtoken"] === null) {
                            statedb.tokens[token]["grefreshtoken"] = rez["refresh_token"];
                            UserDB.addGoogleRefreshToken(user["email"], rez["refresh_token"]);
                            utils.redirect(res, "/oauth-redirect");
                        }
                        if(codeType == "D") {
                            statedb.tokens[token]["d"] = rez["access_token"];
                            UserDB.addDropboxRefreshToken(user["email"], rez["access_token"]);
                            utils.redirect(res, "/oauth-redirect");
                        }
                        utils.sendTemplate(req, res, "templates/mainScreen.html", {
                            "name": (user["name"] + " " + user["surname"]),
                            "smallname": (user["name"][0] + user["surname"][0]),
                            "email": user["email"],
                            "g": rtokens[0],
                            "o": rtokens[1],
                            "d": statedb.tokens[token]["d"] == null ? undefined : statedb.tokens[token]["d"],
                            "strategy": statedb.tokens[token]['uploadmode']
                        },
                        200);
                    })
                }).catch((err) => {
                    console.log(err);
                    utils.sendTemplate(req, res, "templates/errors/error.html", {}, 500);
                })
            }
            else{
                utils.redirect(res, "/");
            }
            
        }
        else if(router.is("/settings")){
            const token = req.headers.cookie.split("=")[1];
            const user = loggedInUsers.findUser(token)
            if(user != undefined) {
                utils.sendTemplate(req,res,"templates/settings-page.html",{
                    "mesaj": "",
                    "name": (user["name"] + " " + user["surname"]),
                    "smallname": (user["name"][0] + user["surname"][0]),
                    
                },200);
            }
            else{
                utils.redirect(res, "/");
            }
        }


        else if(router.is("/getfileid")) {
            const token = req.headers.cookie.split("=")[1];
            const user = loggedInUsers.findUser(token)
            if(user != undefined) {
                const email = router.getParam("email");
                const filename = router.getParam("filename");
                console.log(email, filename);
                const rezult = await FileDB.getFileId(email, filename);
                utils.sendJson(200, res, {
                    "id": rezult[0]
                }); 
            }
            else{
                utils.sendJson(401,res,{"error":"You are not logged in!"});
            }
        }

        else if(router.is("/insertfileid", "POST")) {
            const token = req.headers.cookie.split("=")[1];
            const user = loggedInUsers.findUser(token)
            if(user != undefined){
                const email = requestBody.email;
                const filename = requestBody.filename;
                const id = requestBody.id;
                console.log(email,filename, id);
                FileDB.insertFile(email, filename, id);
                res.writeHead(200);
                res.end();
            }else{
                utils.sendJson(401,res,{"error":"You are not logged in"});
            } 
        }
        else if(router.is("/getCSV","POST")){
            const token = req.headers.cookie.split("=")[1];
            const user = loggedInUsers.findUser(token)
            if(user != undefined){
                let email=requestBody.emails.split(',');
                console.log(email)
                MetadataDB.toCSV(email).then(
                    (csv) => {
                        console.log(csv);
                        utils.sendJson(200,res,{data:csv});
                    }
                ).catch(
                    (err)=>console.log(err)
                );    
            }
            else{
                utils.sendJson(401,res,{"error":"You are not logged in"});
            }
        }
        else if(router.is("/logout")){
            const token = req.headers.cookie.split("=")[1];
            if(loggedInUsers.findUser(token) != undefined){
                loggedInUsers.removeUser(token);
            }
            utils.sendTemplate(req, res,"templates/welcome-page.html",{}, 200);
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