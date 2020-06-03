const https = require('https');
const request = require('request');
const queryString = require('querystring');

const AUTHURL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
const RESPONSE_TYPE = "code";
const CLIENT_ID = "2c83ac7a-b215-4514-b1ea-ecdccc10a903";
const CLIENT_SECRET = "R.Sb1-8IpF8mtEAe_I8KWhPgb6J7.-MYrp";
const SCOPE = "Files.ReadWrite,offline_access,files.read,files.read.all,files.readwrite.all";
const REDIRECT_URI = "https://localhost:8000/oauth-redirect";
const TOKENURL = "https://login.microsoftonline.com/consumers/oauth2/v2.0/token";


let download = () => {

}

let upload = () => {

}

let login = (redirectUri = REDIRECT_URI, responseType = RESPONSE_TYPE, scope = SCOPE) => {
    let requestUri = AUTHURL + "?";
    requestUri += "&client_id=" + CLIENT_ID;
    requestUri += "&scope=" + encodeURIComponent(scope);
    requestUri += "&access_type=offline";
    requestUri += "&response_type=" + responseType;
    requestUri += "&redirect_uri=" + encodeURIComponent(redirectUri);
    
    
    return requestUri;

}

let accessCode = (code, redirectUri = REDIRECT_URI) => {
    let requestUri = TOKENURL;

    let form = {
        "client_id": encodeURIComponent(CLIENT_ID),
        "redirect_uri": redirectUri,
        "client_secret": encodeURIComponent(CLIENT_SECRET),
        "code": code,
        "grant_type": "authorization_code"
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
                hostname: "login.microsoftonline.com",
                path: "/consumers/oauth2/v2.0/token",
                method: "POST",
                port:443
            },
            function (res) {
                
                res.on('data', (d) => {data += d});
                res.on('end', () => {
                    //console.log(data);
                    resolve((JSON.parse(data))['access_token'])
                });
            }
        );
    
        req.on("error", (error) => {
            reject(error);
        })
        //console.log(formData);
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