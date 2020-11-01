const https = require('https');
const request = require('request');
const queryString = require('querystring');

const AUTHURL = "https://www.dropbox.com/oauth2/authorize";
const APP_KEY = "key";
const APP_SECRET = "secret";


let download = () => {

}

let upload = () => {

}

let login = (redirectUri = "https://localhost:8000/oauth-redirect", responseType = "code", scope = "https://www.googleapis.com/auth/drive.file") => {
    let requestUri = AUTHURL + "?";
    requestUri += "client_id=" + APP_KEY;
    requestUri += "&response_type=" + "code";
    requestUri += "&redirect_uri=" + redirectUri;
    return requestUri;

}

let accessCode = (code, redirectUri = "https://localhost:8000/oauth-redirect") => {

    let form = {
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirectUri,
        "client_id": APP_KEY,
        "client_secret": APP_SECRET
    }

    const formData = queryString.stringify(form);   
    const contentLen = formData.length;

    let data = "";

    return new Promise((resolve, reject) => {
        let req = https.request(
            {
                headers: {
                    "Content-Length": contentLen,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                hostname: "api.dropboxapi.com",
                path: "/oauth2/token",
                method: "POST",
                port: 443
            },
            function (res) {
                res.on('data', (d) => {data += d});
                res.on('end', () => {
                    console.log(data);
                    resolve((JSON.parse(data)))
                });
            }
        );
    
        req.on("error", (error) => {
            reject(error);
        })
    
        req.write(formData);
        req.end();
    }
    )

    
}

let listFiles = () => {

}






module.exports={
    "login_link": login,
    "accesscode": accessCode
};
