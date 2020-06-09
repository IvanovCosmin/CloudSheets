let buildTable = () => {
    // var myDiv = document.getElementById('tableContainer');
    // var html = '<table ><tr id="firstRow" class="firstRow"><th>Nr.Crt.</th><th>File name</th><th>Size</th><th>Location</th></tr>'
    // for (let i = 0; i < files.length; i++) {
    //     html += '<tr><th>' + (i + 1) + '</th><th>' + files[i].name + '</th><th>' + files[i].size + '</th><th>' +
    //         files[i].location + '</th></tr>';
    // }
    // html = html + '</table>'
    // myDiv.innerHTML = html;
}

let showError = () => {
    var mySpan = document.getElementById('errorMessage');
    mySpan.style.display = 'block';
    mySpan.innerHTML = "Please introduce all your accounts!"
}

let showProgressBar = async () => {
    document.getElementById('progressBarContainer').style.display = 'block';
    setTimeout(buildTable, 1000);
}


function upload() {
    driveAccount = document.getElementById('drive');
    cloudAccount = document.getElementById('cloud');
    dropboxAccount = document.getElementById('dropbox');
    if (driveAccount.value && cloudAccount.value && dropboxAccount.value) {
        document.getElementById('errorMessage').innerHTML = '';
        document.getElementById('file-input').click();
    }
    else { showError(); }
}

function showName() {
    var name = document.getElementById('file-input');
    var file = document.getElementById('chosen-file');
    if (name.files.item(0).name) {
        file.innerHTML = name.files.item(0).name;
        console.log('Selected file: ' + name.files.item(0).name);
        document.getElementById('startButton').style.display = "block";
    }
};


function showMenu() {
    var menu = document.getElementById('dropdown-content');
    if (menu.style.display === 'block') menu.style.display = 'none';
    else menu.style.display = 'block';
}

function setOauthButtons () {
    if(document.getElementById("google-token").innerHTML != "undefined") {
        document.getElementById("glt").setAttribute("disabled","disabled");
        document.getElementById("glt").innerHTML = "Logged in with Google Drive";
        document.getElementById("glt").classList.add("green")
    }
    if(document.getElementById("dropbox-token").innerHTML != "undefined") {
        document.getElementById("dlt").setAttribute("disabled","disabled");
        document.getElementById("dlt").innerHTML = "Logged in with Dropbox";
        document.getElementById("dlt").classList.add("green")


    }
    if(document.getElementById("onedrive-token").innerHTML != "undefined") {
        document.getElementById("olt").setAttribute("disabled","disabled");
        document.getElementById("olt").innerHTML = "Logged in with Onedrive";
        document.getElementById("olt").classList.add("green")


    }
}