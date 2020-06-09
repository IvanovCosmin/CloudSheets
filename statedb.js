// obiect global care are rolul unui cache.
// asa se evita interogarea excesiva a bazei de date

let tokens = {
}

function addUserId(userid, grt, ort, d, uploadmode) {
    tokens[userid] = {}
    tokens[userid]["grefreshtoken"] = grt; // google refresh token
    tokens[userid]["orefreshtoken"] = ort;
    tokens[userid]["d"] = d; // dropbox access token
    tokens[userid]["uploadmode"] = uploadmode;
}

async function initStatedDb(email, userid, userModel) {
    console.log(userid);
    console.log(email);
    tokens[userid] = {}
    const users = await userModel.getUserByEmail(email);
    const user = users[0]
    if(user !== undefined) {
        console.log(user);
        tokens[userid]["grefreshtoken"] = user.grt;
        tokens[userid]["orefreshtoken"] = user.ort;
        tokens[userid]["d"] = user.drt;
        tokens[userid]["uploadmode"] = user.uploadmode;
    }
}

module.exports = {
    "tokens": tokens,
    "addUserIdData": addUserId,
    "initStatedDb": initStatedDb
}