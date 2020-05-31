const sendHttpRequest = (method,url,data) =>{
    return fetch(url,{
        method: method,
        body: JSON.stringify(data),
        headers: data ? {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'} : {'Access-Control-Allow-Origin': '*'}
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


function authMe() {
    /*sendHttpRequest('GET','https://login.live.com/oauth20_authorize.srf?client_id=2c83ac7a-b215-4514-b1ea-ecdccc10a903&scope=Files.ReadWrite,offline_access,files.read,files.read.all,files.readwrite.all&response_type=token&redirect_uri=https://localhost:8000/').then(
    (res) => {
        console.log(res);
    })
    .catch((err)=>{
        console.log(err);
    });*/
    window.location.replace('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=2c83ac7a-b215-4514-b1ea-ecdccc10a903&scope=Files.ReadWrite,offline_access,files.read,files.read.all,files.readwrite.all&response_type=token&redirect_uri=https://localhost:8000/static/onedrive-upload/');
}
