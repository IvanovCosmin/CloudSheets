const sendHttpRequest = (method,url,headers,data) =>{
    return fetch(url,{
        method: method,
        body: JSON.stringify(data),
        headers: headers
    }).then(
        res => {
            if(!res.ok){
                return res.json().then(
                    err => {
                        const error = new Error('Error!');
                        error.data = err;
                        throw error;
                    }
                );
            }
            return res.json();
        }
    );
};

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?#]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}



function upload() {
    file = document.getElementById("setfile");
    var reader = new FileReader();
    

    reader.onloadend = function () {
       sendHttpRequest("PUT",'https://graph.microsoft.com/v1.0/me/drive/root:/New Folder/'+file.files[0].name+':/content',{'Content-Type':'text/plain','Access-Control-Allow-Origin':'*',"Authorization":getUrlVars()["access_token"]},reader.result).then(
            (data)=>{ 
                var url = new URL(`https://localhost:8000/onedriveAPI/upload?email=${"paul_man70@yahoo.com"}&file=${data.name}&id=${data.id}`);
                //url.search = new URLSearchParams({ email: "paul_man70@yahoo.com", file: data.name, id: data.id }).toString();
                sendHttpRequest("PUT",url,{'Content-Type':'text/plain','Access-Control-Allow-Origin':'*',"Authorization":getUrlVars()["access_token"]},{}).then(
                    (data) =>{
                        console.log(data);
                    }
                );
                console.log(data.name);
                console.log(data.id);
            }
        );
       
        //console.log(reader.result);
    }

    reader.readAsArrayBuffer(file.files[0]);
    
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function downloadOnedrive(){
    sendHttpRequest("GET","https://graph.microsoft.com/v1.0/me/drive/items/A077C1791488E01E!3340/content",{'Content-Type':'application/json','Access-Control-Allow-Origin':'*',"Authorization":getUrlVars()["access_token"]}).then(
            (data)=>{
                console.log(data);
                download("da.txt",data);
            }
        );
}

