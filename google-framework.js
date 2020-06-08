const https = require('https');
const request = require('request');
const queryString = require('querystring');

const AUTHURL = "https://accounts.google.com/o/oauth2/v2/auth";
const CLIENT_ID = "266783443118-2adtqo6evqr9k098qok16kr2tpjrdup7.apps.googleusercontent.com";
const CLIENT_SECRET = "T7gRcNU-frdHhL-4ppYP45YP";
const TOKENURL = "https://oauth2.googleapis.com/token";


let download = () => {

}

let upload = () => {

}

let login = (redirectUri = "https://localhost:8000/oauth-redirect", responseType = "code", scope = "https://www.googleapis.com/auth/drive.file") => {
    let requestUri = AUTHURL + "?";
    requestUri += "scope=" + encodeURIComponent(scope);
    requestUri += "&access_type=offline";
    requestUri += "&response_type=" + responseType;
    requestUri += "&redirect_uri=" + encodeURIComponent(redirectUri);
    requestUri += "&client_id=" + CLIENT_ID;
    
    return requestUri;

}

let askForFirstToken = (code, redirectUri = "https://localhost:8000/oauth-redirect") => {
    let requestUri = TOKENURL;

    let form = {
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirectUri,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
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
                hostname: "oauth2.googleapis.com",
                path: "/token",
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

let accessCode = (code, redirectUri = "https://localhost:8000/oauth-redirect") => {
    return new Promise((resolve, reject) => {
        askForFirstToken(code, redirectUri).then(
            (object) => {
                refreshToken(object["refresh_token"]).then(
                    (accToken) => {
                        resolve(accToken);
                    }
                )
            }
        )
        .catch((err) => reject(err));
    });
}

let refreshToken = (rtoken) => {
    let requestUri = TOKENURL;

    let form = {
        "refresh_token": rtoken,
        "grant_type": "refresh_token",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
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
                hostname: "oauth2.googleapis.com",
                path: "/token",
                method: "POST",
                port: 443
            },
            function (res) {
                res.on('data', (d) => {data += d});
                res.on('end', () => {
                    console.log(data)
                    resolve((JSON.parse(data))['access_token'])
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
    "accesscode": accessCode,
    "refreshToken": refreshToken
};