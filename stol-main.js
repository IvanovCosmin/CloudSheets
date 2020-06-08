var fs = require("fs");

// checks if a code comes from google/dropbox/onedrive.
// poate fi facuta cu un state in url, dar nu e necesar
let getCodeType = (code) => {
    if(code.length===37){
        return "O";
    }
    else
    if (code.length > 85) {
        return "G";
    }
    else {
        return "D";
    }
}

// asta e aici pentru a nu strica arhitectura curenta a codului
// este folosita pentru oauth-redirect
let emptyWorkingObject = {
    accesscode: (code) => {
        return new Promise((resolve, reject) => {
            resolve(undefined);
        })
    }
}

module.exports = {
    getCodeType: getCodeType,
    emptyWorkingObject: emptyWorkingObject
} 