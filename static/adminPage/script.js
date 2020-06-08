const sendHttpRequest = (method,url,headers,data) =>{
    return fetch(url,{
        method: method,
        body: data,
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


function showMenu() {
    var menu = document.getElementById('dropdown-content');
    if (menu.style.display === 'block') menu.style.display = 'none';
    else menu.style.display = 'block';
}



var emails = [];

var selectedUsers = [];

function showClients() {
    let list = document.getElementById("clients-list");
    let html='';
    sendHttpRequest("GET","https://localhost:8000/allusers").then(
        (data) =>{
            emails = data.data;
            for(i=0;i<data.data.length;i++){  
            html = html + '<button id="'+data.data[i]+ '" class="select-user" onclick="onClickUser(this.id)">'+data.data[i]+'</button>';
            list.innerHTML=html;
        }
        
    });
    
}

function onClickUser(id) {
    if(!selectedUsers.includes(id)) {selectedUsers.push(id);
        document.getElementById(id).style.background='#0BD54F';
    }
    else {selectedUsers.splice(selectedUsers.indexOf(id),1);
        document.getElementById(id).style.background='transparent';
}
   console.log(selectedUsers);
   if(selectedUsers.length>0){
       document.getElementById('export-button').style.display='block';
   }
   else{
    document.getElementById('export-button').style.display='none';
   }
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

function DownloadCSV(){
    var requestUrl = 'https://localhost:8000/getCSV';
    var payload = new FormData();
    payload.append('emails', selectedUsers);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", requestUrl);
    xhr.send(payload);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            result = JSON.parse(xhr.response)["data"];
            download("data.csv",result);
        }
    }

}

document.addEventListener("DOMContentLoaded", showClients);