var sq3 = require('sqlite3');
var config = require('./config');


function DataBase(){
    var obj={
    db : new sq3.Database(config['dbpath']),
    
    closeDatabase:function() {
        this.db.close();
        console.log(this.db);
        console.log("wtf");
    },

    createTable:function() {
        let db = new sq3.Database(config['dbpath']);
        db.run('CREATE TABLE user(email text, password text, name text , surname text )');
        db.run('CREATE TABLE user_onedrive_files(email text, fisier text , id_fisier text )');
        db.close();
    },
    
    dropTable:function() {
        let db = new sq3.Database(config['dbpath']);
        db.run('drop TABLE user');
        db.run('drop table user_onedrive_files')
        db.close();
    },
    
    insertUser :function(email, password, name, surname)  {
        this.db.run(`INSERT INTO user(email, password, name, surname) VALUES(?,?,?,?)`, [email, password, name, surname], function(err) {
            if (err) {
              return console.log(err.message);
            }
            
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    },
    
    
    getUserByEmail  :function(email)  {

        return new Promise((resolve, reject) => {
            let result = [];
            this.db.each(`select * from user where email='${email}' LIMIT 1;`, (err, row) => {
                if(err) { reject(err); }
                result.push(row);
                console.log(row);
            }, () => {
                resolve(result);
            });
        });
    },
    
    getAllUsers :function()  {
        
        return new Promise((resolve,reject)=>{
            let result=[];
            this.db.each('select * from user;',(err,row) =>{
                if(err) {reject(err);}
                result.push(row);
                
            } , () => {
                resolve(result);
            })
        })  

    },

    getAllOnedriveFiles :function() {
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

    getOnedriveFileId :function(email,name) {
        return new Promise((resolve,reject)=>{
            let result=[];
            this.db.each(`select * from user_onedrive_files where email = ${email} and fisier = ${name};`,(err,row) =>{
                if(err) {reject(err);}
                result.push(row);
                
            } , () => {
                resolve(result);
            })
        }) 
    },

    insertOnedriveFile :function(email, name, id)  {
        this.db.run(`INSERT INTO user_onedrive_files(email, fisier, id_fisier) VALUES(?,?,?)`, [email, name , id], function(err) {
            if (err) {
              return console.log(err.message);
            }
            
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }
};

return obj;

}

module.exports={
    "DataBase":DataBase
};