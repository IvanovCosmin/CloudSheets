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