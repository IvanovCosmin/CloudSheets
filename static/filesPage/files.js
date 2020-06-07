// var files = [
//     {
//         'name': 'Tema_psgbd',

//     },
//     {
//         'name': 'Filme_porno',

//     },
//     {
//         'name': 'Carte_bucate',

//     },
//     {
//         'name': 'Chestie',

//     },

// ];

function getUserFiles(){
    var requestUrl='/getUserFiles?email={email}'.replace("{email}",window.localStorage.getItem("email"));
    xhr = new XMLHttpRequest();
    var result=undefined;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            result = JSON.parse(xhr.response)["data"];
        }
    }
    xhr.open("GET", requestUrl,false); 
    xhr.send();
    result=JSON.parse(xhr.response);
    console.log("lalalala",result, result.data.length);
    showFiles(result.data);
}

function showFiles(files) {
    var list = document.getElementById("filesList");
    var html = '';
    for (i = 0; i < files.length; i++) {
        var size = parseFloat(files[i].size);
        size=size/1024;
        html += '<div class="file"><img class="fileIcon" src="../assets/file.svg" alt="file icon"/><div class="fileInfo"><span class="fileTitle">' +
            files[i].file_name + ' ('+size+' KB)'+'</span><button class="fileLink"/>Download</button></div></div>'
            console.log(html);
    }
    list.innerHTML = html;
}

document.addEventListener("DOMContentLoaded",getUserFiles);