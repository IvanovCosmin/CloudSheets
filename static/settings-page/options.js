function showMenu() {
    var menu = document.getElementById('dropdown-content');
    if (menu.style.display === 'block') menu.style.display = 'none';
    else menu.style.display = 'block';
    }

function showPriorities(){
    document.getElementById("priorities").style.display = "block";
}

function notShowPriorities(){
    document.getElementById("priorities").style.display = "none";
}

if("{{ mesaj }}" == "undefined"){
    document.getElementById("uplmsg").style.visibility= "hidden";
}else
if("{{ mesaj }}" != "Succes!"){
    document.getElementById("uplmsg").style.color= "red";
}

document.getElementById("email").value=localStorage.getItem("email");
document.getElementById("email").style.display = "none";