var sq3 = require('sqlite3');
var config = require('../config');

function MetadataModel(db){
    var obj={
        db:db,
        
        insertUserFile :function(name,size,chunks,email) {
            console.log("Metadata");
            this.db.run(`INSERT INTO uploaded_files(file_name,size,chunks,user_email) VALUES(?,?,?,?)`, [name,size,chunks,email], function(err) {
                if (err) {
                return console.log(err.message);
                }
                
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            });
        },
        toCSV:function(email){
            return new Promise((resolve,reject)=>{
                let result="";
                this.db.each('select * from uploaded_files where user_email = ?;',[email],(err,row) =>{
                    if(err) {reject(err);}
                    result=result+row.user_email+','+row.file_name+','+row.size+','+row.chunks+'\n';
                    
                } , () => {
                    resolve(result);
                });
            });
    
        }
    }

    return obj;
}
module.exports={
    "CreateMetadataModel":MetadataModel
}