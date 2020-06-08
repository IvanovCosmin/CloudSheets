if(document.getElementById("onedrive-token").innerHTML != "undefined") {
    window.localStorage.setItem("O", document.getElementById("onedrive-token").innerHTML);
}
if(document.getElementById("google-token").innerHTML != "undefined") {
    window.localStorage.setItem("G", document.getElementById("google-token").innerHTML);
}
if(document.getElementById("dropbox-token").innerHTML != "undefined") {
    window.localStorage.setItem("D", document.getElementById("dropbox-token").innerHTML);
}
if(document.getElementById("user-email").innerHTML != "undefined") {
    window.localStorage.setItem("email", document.getElementById("user-email").innerHTML);
}

var Dropbox = {
    code: window.localStorage.getItem("D"),
    URL_DOWNLOAD_DROPBOX: "https://content.dropboxapi.com/2/files/download",
    writeToDownloadStream: async function(name) {
        var fetchSettings = {
            headers: {
                //"Content-Type": 'multipart/mixed; boundary="END_OF_PART"',
                "Authorization": "Bearer " + this.code,
                "Dropbox-API-Arg": JSON.stringify({
                    "path": "/cloudsheets/" + name
                })
            },
            method: "GET"
        }
        console.log(fetchSettings);
        
        var fetchData = await fetch(this.URL_DOWNLOAD_DROPBOX, fetchSettings);
        console.log(fetchData);
        
        response = new Response(fetchData.body);
        console.log(response);
        return response;
    },
    upload: async function(filename, blob) {
        var meta = JSON.stringify({
            "path": "/cloudsheets/" + filename,
            "mode": "add",
            "autorename": true,
            "mute": false,
            "strict_conflict": false
        })
        var content = blob;
        var payload = new FormData();
        payload.append('file', content);
        xhr = new XMLHttpRequest();
        xhr.open('post', 'https://content.dropboxapi.com/2/files/upload');
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.code);
        xhr.setRequestHeader('Dropbox-API-Arg', meta);
        xhr.setRequestHeader('Content-Type', "application/octet-stream");
        xhr.onload = function() {
            console.log(xhr.response);
        };
        xhr.send(payload);
    }
}
var Google = {
    code: window.localStorage.getItem("G"),
    URL_UPLOAD: "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    URL_DOWNLOAD: "https://www.googleapis.com/drive/v3/files/fileId?fields=webContentLink&alt=media",
    URL_LIST_FILES: "https://www.googleapis.com/drive/v3/files",

    _searchFileCallback: function(res, name) {
        return new Promise( (resolve, reject) => {
            var files = res.files;
            console.log(files);
            for(item of files) {
                if(item["name"] == name) {
                    resolve(item["id"]);
                }
            }
            reject("Could not find name in while listing files on google");
        });
        
    },
    writeToDownloadStream: async function(filename) {
        var fileId = await this.searchFile(filename);
        return this._writeToDownloadStream(fileId);
    },
    _writeToDownloadStream: async function(id) {
        var fetchSettings = {
            headers: {
                //"Content-Type": 'multipart/mixed; boundary="END_OF_PART"',
                "Authorization": "Bearer " + this.code
                
            },
            method: "GET"
        }
        
        var fetchData = await fetch(this.URL_DOWNLOAD.replace("fileId", id), fetchSettings);
        console.log(fetchData);
        
        response = new Response(fetchData.body);
        console.log(response);
        return response;
    },
    listFiles: function(callback = console.log) {
        var fetchSettings = {
            headers: {
                //"Content-Type": 'multipart/mixed; boundary="END_OF_PART"',
                "Authorization": "Bearer " + this.code
                
            },
            method: "GET"
        }

        fetch(this.URL_LIST_FILES, fetchSettings)
        .then(data => data.json().then(res => callback(res)))
        .catch(err => console.log(err));
    },
    searchFile: function(filename) {
        return new Promise ((resolve, reject) => {
                var fetchSettings = {
                    headers: {
                        "Authorization": "Bearer " + this.code
                        
                    },
                    method: "GET"
                }

                fetch(this.URL_LIST_FILES, fetchSettings)
                .then(data => data.json().then(res => {
                    var files = res.files;
                    for (file of files) {
                        if (file["name"] == filename) {
                            resolve(file["id"]);
                        }
                    }
                }))
                .catch(err => reject(err));
        });
    },
    upload: async function (filename, blob) {
        var meta = JSON.stringify({
            name: filename,
            mimeType: 'application/octet-stream',
        })

        var content = blob;
        var payload = new FormData();
        payload.append('metadata', new Blob([meta], {type: 'application/json'}));
        payload.append('file', content);
        xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.code);
        xhr.onload = function() {
            console.log(xhr.response);
        };
        xhr.send(payload);
    }
}
var Onedrive = {
    code: window.localStorage.getItem("O"),
    URL_DOWNLOAD: "https://graph.microsoft.com/v1.0/me/drive/items/fileId/content",
    URL_UPLOAD: "https://graph.microsoft.com/v1.0/me/drive/root:/CloudSheets/",
    writeToDownloadStream: async function(filename) {
        var id = this.getIdFromFilename(filename);
        return this._writeToDownloadStream(id);
    },
    _writeToDownloadStream: async function(id) {
        var fetchSettings = {
            headers: {
                //"Content-Type": 'multipart/mixed; boundary="END_OF_PART"',
                "Authorization": this.code,
                'Content-Type':'application/json'
            },
            method: "GET"
        }
        var URL_DOWNLOAD = "";
        var fetchData = await fetch(this.URL_DOWNLOAD.replace("fileId", id), fetchSettings);
        console.log(fetchData);
        
        response = new Response(fetchData.body);
        console.log(response);
        return response;
    },
    upload: async function(filename, blob) {
        var requestUrl = this.URL_UPLOAD;
        requestUrl += filename;
        requestUrl += ":/content";
        var payload = new FormData();
        payload.append('file', blob);

        var xhr = new XMLHttpRequest();
        xhr.open("PUT", requestUrl)
        xhr.setRequestHeader('Authorization', this.code);
        xhr.setRequestHeader('Content-Type', "application/octet-stream");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var id = JSON.parse(xhr.response)["id"];
                Onedrive.setIdForFilename(filename, id);
            }
        }
        xhr.send(payload);
    },
    getIdFromFilename: function(filename) {
        var requestUrl = "/getfileid?email={email}&filename={filename}"
                        .replace("{email}", localStorage.getItem("email"))
                        .replace("{filename}", filename);
        xhr = new XMLHttpRequest();
        var result = undefined;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log("get id", xhr.response)
                result = JSON.parse(xhr.response)["id"]["id_fisier"];
            }
        }
        xhr.open("GET", requestUrl, false); // false makes it synchronous
        xhr.send();
        console.log(result);
        return result;
    },
    setIdForFilename: function(filename, id) {
        var requestUrl = "/insertfileid";
        xhr = new XMLHttpRequest();
        var payload = new FormData();
        payload.append("filename", filename);
        payload.append("email", localStorage.getItem("email"));
        payload.append("id", id);
        xhr.open("POST", requestUrl);
        xhr.send(payload);
    }
}
    
//localStorage.setItem("{{ codeType }}", "{{ code }}");
Dropbox.code = localStorage.getItem("D");
Google.code = localStorage.getItem("G");
Onedrive.code = localStorage.getItem("O");

// functia asta e vina si rusinea lui Cosmin.
function parseMetaFile(metafile) {
    let metaarray = metafile.split("\n");
    metaarray.splice(metaarray.length - 1, 1); // stergem ultimul element e plin doar de bytes goi
    console.log(metaarray);
    let res = {};
    res["size"] = parseInt(metaarray[0]);
    for (let i = 1; i < metaarray.length; i++) {
        let chunkData = metaarray[i].split(" ");
        res[chunkData[1]] = chunkData[0];
    }
    return res;
}


function deleteFileFromFS(filename) {
    FS.unlink('/' + filename); // will be deleted when not used by any process
}

async function downloadFromStreams(filename, names, downloadStreams, cloudProviders) {
    var blobArray = [];
    console.log(downloadStreams);
    var index = 0;
    for(name of names) {
        var distanceToContent = 40; //primii 40 de bytes sunt headerul raspunsului pentru dropbox si onedrive
        var toDeleteFromEnd = 0;
        var blob = await downloadStreams[name].blob(); 
        console.log(cloudProviders[index]);
        console.log(cloudProviders);
        if(cloudProviders[index] != "G") {
            // la onedrive si la dropbox  raspunsul este de timp form data si trebuie scos fisierul de acolo
            var header = await blob.slice(0, 200).text();
            var footer = await blob.slice(blob.size - 200, blob.size - 1).text();
            var newLineCounter = 0;
            for(var i = 0; i < 200; i ++) {
                if(header[i] == '\r') {
                    newLineCounter += 1;
                }
                if(newLineCounter == 4) {
                    distanceToContent = distanceToContent + i + 2;
                    break;
                }
            }
            newLineCounter = 0;
            for(var i = footer.length - 1; i >= footer.length - 200; i--) {
                if(footer[i] == '\r') {
                    newLineCounter += 1;
                }
                if(newLineCounter == 2) {
                    toDeleteFromEnd = blob.size - (footer.length - i) - 1;
                    break;
                }
            }
            blob = blob.slice(distanceToContent, toDeleteFromEnd);
        }
        else {
            blob = blob.slice(distanceToContent);
        }
        index += 1;
        blobArray.push(blob); 
    }
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var newBlob = new Blob(blobArray, {type : 'application/octet-stream'})
    a.href = URL.createObjectURL(newBlob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(newBlob);
}

function presetDownloadStreams(downloadStreams, names) {
    for(index in names) {
        downloadStreams[names[index]] = undefined;
    }
    return downloadStreams;
}

function getCloudProviderForFile(names) {
    return new Promise((resolve, reject) => {
        var URL = "/get-providers-for-files";
        var fetchSettings = {
            "headers": {
                "data": JSON.stringify({
                    "names": names
                })
            },
            "method": "GET",
        }
        fetch(URL, fetchSettings)
            .then((data) => {
                return data.json();
            })
            .then(((res) => {
                resolve(res);
            }))
            .catch((err) => {
                reject(err);
            });
    });
}

function getDownloadStreamCallback(i, names, downloadStreams) {
    var localCallback = (dlStream) => {
                console.log("names", names);
                console.log("names", i);
                downloadStreams[names[i]] = dlStream;
                console.log("Dld stream set", downloadStreams)
            };

    return localCallback;
}

// names = { "index": "filename" } (chiar daca e array)
async function downloadFilesByNames(filename, names) {
    var downloadStreams = {};
    downloadStreams = presetDownloadStreams(downloadStreams, names);
    console.log("Dld streams init", downloadStreams);
    var cloudProviders = await getCloudProviderForFile(names);
    cloudProviders = cloudProviders["names"];
    var workingObj = undefined;
    var promises = [];
    console.log(cloudProviders);
    console.log(names);
    for (var i = 0; i < names.length; i++) {
        if(cloudProviders[i] == "D") {
            workingObj = Dropbox;
        }
        else if (cloudProviders[i] == "G") {
            workingObj = Google;
        }
        else if (cloudProviders[i] == "O") {
            workingObj = Onedrive;
        }
        else {
            console.error("Unexpected cloud provider", cloudProviders[i]);
            return false;
        }

        var localCallback = getDownloadStreamCallback(i, names, downloadStreams);
        
        promises.push(workingObj.writeToDownloadStream(names[i]).then(
            localCallback
        ));
    }
    Promise.all(promises).then((result) => {
        downloadFromStreams(filename, names, downloadStreams, cloudProviders);
    })
}

var UploadManger = {
    _fileIndex: 0,
    _mockFileIndex: 0,
    _strategy: "equal",
    uploadFile: function(blob, element) {
        if (this._fileIndex % 3 == 0) {
            console.log("Uploading google element", element);
            Google.upload(element, blob);
        }
        else if (this._fileIndex % 3 == 1){
            console.log("Uploading dropbox element", element);
            Dropbox.upload(element, blob);
        }
        else {
            console.log("Uploading onedrive element", element);
            Onedrive.upload(element, blob);
        }
        
        this._fileIndex++;
    },
    // used before the files are uploaded to get the names of the cloud providers
    getNextUploadLocationMocked: function() {
        this._mockFileIndex++;
        if ((this._mockFileIndex - 1) % 3 == 0) {
            return "GoogleDrive";
        }
        else if ((this._mockFileIndex - 1) % 3 == 1){
            return "Dropbox";
        }
        else {
            return "OneDrive";
            
        }
    }
    
}

function sendMetadata(fileName, size, files) {
    var requestUrl = '/sendMetadata';
    var payload = new FormData();
    payload.append('fileName', fileName);
    payload.append('size', size);
    payload.append('files', files);
    payload.append('email', localStorage.getItem("email"));

    var xhr = new XMLHttpRequest();
    xhr.open("POST", requestUrl)
    xhr.send(payload);
}

function createLoadingBarsForSplitFiles(metadataFile) {
    console.log("createLoadingBars")
    var files = metadataFile.match(/[a-zA-Z0-9]+\.csht/g)
    var uploadFiles = document.getElementById("upload-files");
    var myDiv = document.getElementById('tableContainer');
    var html = '<table ><tr id="firstRow" class="firstRow"><th>Nr.Crt.</th><th>File name</th><th>Location</th></tr>'
    console.log(files);
    files.forEach((element,i) => {
        html += '<tr><th>' + (i + 1) + '</th><th>' + element + '</th><th>' +
                            UploadManger.getNextUploadLocationMocked() + '</th></tr>';
    });
    html = html + '</table>'
    myDiv.innerHTML = html;
    files.forEach(element => {
        var stream = FS.open("/" + element, "r");
        console.log(stream);
        var filestats = FS.stat('/' + element);
        var blob = new Blob([stream.node.contents], {type: "application/octet-stream"});
        console.log(blob);
        UploadManger.uploadFile(blob, element);
        FS.close(stream);
        deleteFileFromFS(element);
    });
    let file = document.getElementById("file-input").files[0];
    sendMetadata(file.name, file.size, files);
}

function readFile() {
    var files = document.getElementById("file-input").files;
    var file = files[0];
    var fileReader = new FileReader();
    fileReader.onload = function() {
        var data = new Uint8Array(fileReader.result);
        console.log(data);
        Module['FS_createDataFile']('/', 'fileinput', data, true, true, true);
        Module['FS_createDataFile']('/', 'metadata', new Uint8Array([]), true, true, true);
        var nrOfFiles = Module.ccall('readFile', 'number', [], null);
        console.log("nrOfFiles returned by readFile", nrOfFiles);
        for(var i = 0; i < nrOfFiles; i++) {
            Module.ccall('generateNthSplitFile', 'boolean', ['number'], [i + 1]);
        }
        deleteFileFromFS('fileinput');
        Module.ccall('showMetadata', null, [], []);
        var stream = FS.open("/metadata", "r");
        var textStream = new TextDecoder("utf-8").decode(stream.node.contents);
        var blob = new Blob([textStream.toString()], {type: "application/octet-stream;charset=utf-8"});
        console.log(blob);
        createLoadingBarsForSplitFiles(textStream.toString());
    }
    console.log(file);
    fileReader.readAsArrayBuffer(file);
    

    return fileReader;
}