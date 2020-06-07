var sq3 = require('sqlite3');
var config = require('./config');


function DataBase(){
    var obj={
    db : new sq3.Database(config['dbpath']),
    
    closeDatabase:function() {
        this.db.close();
        console.log("s-a inchis si s ar putea ca paul sa fie prost")
    },

    createTable:function() {
        let db = new sq3.Database(config['dbpath']);
        db.run('CREATE TABLE user(email text, password text, name text , surname text , uploadmode text , first text , second text ,third text)');
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
        // vezi ca s ar putea sa intri pe contul lui ma ta
        this.db.run(`INSERT INTO user(email, password, name, surname , uploadmode , first ,second ,third) VALUES(?,?,?,?,?,?,?,?)`, [email, password, name, surname , 'Smart Sheet' , 'Google Drive' , 'Onedrive' , 'Dropbox'], (err)=> {
            if (err) {
              return console.log(err.message);
            }
            else{
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
        });
        console.log("AICI");
    },
    
    
    getUserByEmail  :function(email)  {

        return new Promise((resolve, reject) => {
            let result = [];
            this.db.each(`select * from user where email='${email}' LIMIT 1;`, (err, row) => {
                if(err) { reject(err); }
                result.push(row);
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
    },
    smallUpdate :function(email,name,surname,uploadmode,first,second,third){
        return new Promise((resolve,reject)=>{

            if(name!=""){
                this.db.run(`UPDATE user SET name = ? where email = ?`, [name,email],function(err){
                    if(err){
                        reject(err);
                    }
                });
            }
            if(surname!=""){
                this.db.run(`UPDATE user SET surname = ? where email = ?`, [surname,email],function(err){
                    if(err){
                        reject(err);
                    }
                });
            }
            if(uploadmode!=undefined){
                this.db.run(`UPDATE user SET uploadmode = ? where email = ?`, [uploadmode,email],function(err){
                    if(err){
                        reject(err);
                    }
                });
            }
            if(uploadmode == "Priority"){
                if(first!=""){
                    this.db.run(`UPDATE user SET first = ? where email = ?`, [first,email],function(err){
                        if(err){
                            reject(err);
                        }
                    });
                }
                if(second!=""){
                    this.db.run(`UPDATE user SET second = ? where email = ?`, [second,email],function(err){
                        if(err){
                            reject(err);
                        }
                    });
                }
                if(third!=""){
                    this.db.run(`UPDATE user SET third = ? where email = ?`, [third,email],function(err){
                        if(err){
                            reject(err);
                        }
                    });
                }   
            }
            resolve(true);
        });
        
    },
    updateProfile :function(email,name,surname,oldpassword,newpassword,uploadmode,first,second,third){
        return new Promise((resolve,reject)=>{
            if(newpassword!=""){
                this.getUserByEmail(email).then(
                    (user) =>{
                        if(oldpassword==user[0].password){
                            this.db.run(`UPDATE user SET password = ? where email = ?`, [newpassword,email],function(err){
                                if(err){
                                    reject(err);
                                }
                            });
                            this.smallUpdate(email,name,surname,uploadmode,first,second,third).then(
                                (res)=> resolve(res)
                            ).catch(
                                (err)=>reject(err)
                            );
                        }
                        else{
                            resolve(false);
                        }
                    }
                );
            }
            else{
                this.smallUpdate(email,name,surname,uploadmode,first,second,third);
                resolve(true);
            } 
        });
        
    }
};

return obj;

}

module.exports={
    "DataBase":DataBase
};