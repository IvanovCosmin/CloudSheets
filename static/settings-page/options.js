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

document.getElementById("numeUtilizator").innerHTML = localStorage.getItem("name") + " " + localStorage.getItem("surname");
document.getElementById("initialeUtilizator").innerHTML = localStorage.getItem("name")[0] + localStorage.getItem("surname")[0];
