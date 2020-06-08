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



function setPageUp () { 
    console.log("loaded")
    document.getElementById("email").value=localStorage.getItem("email");
    document.getElementById("email").style.display = "none";
    if(document.getElementById("uplmsg").innerHTML === ""){
        document.getElementById("uplmsg").style.visibility= "hidden";
    }else if(document.getElementById("uplmsg").innerHTML != "Succes!"){
        document.getElementById("uplmsg").style.color= "red";
    }
}
