var files = [
    {
        'name': 'Tema_psgbd',
        'location': 'metadata'
    },
    {
        'name': 'Filme_porno',
        'location': 'metadata'
    },
    {
        'name': 'Carte_bucate',
        'location': 'metadata'
    },
    {
        'name': 'Chestie',
        'location': 'metadata'
    },

];

function showFiles() {
    var list = document.getElementById("filesList");
    var html = '';
    for (i = 0; i < files.length; i++) {
        html += '<div class="file"><img class="fileIcon" src="../assets/file.svg" alt="file icon"/><div class="fileInfo"><span class="fileTitle">' +
            files[i].name + '</span><a class="fileLink" href=""/>' + files[i].location + '</a></div></div>'
    }
    list.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", showFiles);