var fs = require("fs");

// checks if a code comes from google/dropbox/onedrive.
// poate fi facuta cu un state in url, dar in limbaj academic "e traseu"
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

module.exports = {
    getCodeType: getCodeType
} 