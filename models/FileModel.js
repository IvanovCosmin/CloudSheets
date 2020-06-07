var sq3 = require('sqlite3');
var config = require('../config');

function FileModel(db){
    var obj={
        db:db,
        getAllFiles :function() {
            return new Promise((resolve,reject)=>{
                let result=[];
                this.db.each(`select * from user_onedrive_files;`,(err,row) =>{
                    if(err) {reject(err);}
                    result.push(row);
                    
                } , () => {
                    resolve(result);
                })
            }) 
        },
    
        getFileId :function(email,name) {
            return new Promise((resolve,reject)=>{
                let result=[];
                this.db.each(`select * from user_onedrive_files where email = '${email}' and fisier = '${name}';`,(err,row) =>{
                    if(err) {reject(err);}
                    result.push(row);
                    
                } , () => {
                    resolve(result);
                })
            }) 
        },
    
        insertFile :function(email, name, id)  {
            this.db.run(`INSERT INTO user_onedrive_files(email, fisier, id_fisier) VALUES(?,?,?)`, [email, name , id], function(err) {
                if (err) {
                  return console.log(err.message);
                }
                
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            });
        }
    
    }

    return obj;
}
module.exports={
    "CreateFileModel":FileModel
}