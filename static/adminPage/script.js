function showMenu() {
    var menu = document.getElementById('dropdown-content');
    if (menu.style.display === 'block') menu.style.display = 'none';
    else menu.style.display = 'block';
}

var mock = [
    "ala",
    "bala",
    "portocala"
]

var selectedUsers = [];

function showClients() {
    let list = document.getElementById("clients-list");
    let html='';
    for(i=0;i<mock.length;i++){
        
        html = html + '<button id="'+mock[i]+ '" class="select-user" onclick="onClickUser(this.id)">'+mock[i]+'</button>';
    }
    list.innerHTML=html;
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

document.addEventListener("DOMContentLoaded", showClients);