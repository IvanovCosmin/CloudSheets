let router_utils = require("../router-utils");

function test1(){
    requsetBody = router_utils.parseBodyFormData("email=paul_man70%40yahoo.com&password=Paul1234");
    if(requsetBody === {email:'paul_man70%40yahoo.com',password:'Paul1234'}){
        console.log("OK");
    }
    else{
        console.log("!OK");
    }
} 

test1();