var sq3 = require('sqlite3');
var config = require('../config');

function MetadataModel(db){
    var obj={
        db:db,
        
        insertUserFile :function(name,size,chunks,email) {
            this.db.run(`INSERT INTO uploaded_files(file_name,size,chunks,user_email) VALUES(?,?,?,?)`, [name,size,chunks,email], function(err) {
                if (err) {
                return console.log(err.message);
                }
                
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            });
        },
        toCSV:function(email){
            let sqlcode = "select * from uploaded_files where ";
            for( i = 0 ;i<email.length-1;i++){
                sqlcode += "user_email = ? or ";
            }
            sqlcode += "user_email = ?;";
            return new Promise((resolve,reject)=>{
                let result="";
                this.db.each(sqlcode,email,(err,row) =>{
                    if(err) {reject(err);}
                    result=result+row.user_email+','+row.file_name+','+row.size+','+row.chunks+'\n';
                    
                } , () => {
                    resolve(result);
                });
            });
    
        },
        getUserFiles :function(email) {
            return new Promise((resolve,reject)=>{
                let result=[];
                this.db.each(`select * from uploaded_files where user_email='${email}';`,(err, row) => {
                    if(err) { reject(err); }
                    result.push(row);
                }, () => {
                    resolve(result);
                })
            } );
        },
        getFile :function(name,size){
            return new Promise((resolve,reject)=>{
                let result=[];
                this.db.each(`select * from uploaded_files where file_name = '${name} and size='${size} Limit 1';`,(err, row) => {
                    if(err) { reject(err); }
                    result.push(row);
                }, () => {
                    resolve(result);
                })
            } );
        }
    }

    return obj;
}
module.exports={
    "CreateMetadataModel":MetadataModel
}