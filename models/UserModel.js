var sq3 = require('sqlite3');
var config = require('../config');

function UserModel(db){
    var obj={
        db:db,
        insertUser :function(email, password, name, surname)  {
            this.db.run(`INSERT INTO user(email, password, name, surname , uploadmode ) VALUES(?,?,?,?,?)`, [email, password, name, surname , 'Equal Distribution'], (err)=> {
                console.log("coita???");
                if (err) {
                  return console.log(err.message);
                }
                else{
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                }
            });
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
                    result.push(row.email);
                    
                } , () => {
                    resolve(result);
                });
            });
    
        },
        _smallUpdate :function(email,name,surname,uploadmode){
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
                resolve(true);
            });
            
        },
        updateProfile :function(email,name,surname,oldpassword,newpassword,uploadmode){
            return new Promise((resolve,reject)=>{
                if(newpassword!=""){
                    this.getUserByEmail(email).then(
                        (user) =>{
                            console.log(user);
                            console.log(email);
                            if(oldpassword==user[0].password){
                                this.db.run(`UPDATE user SET password = ? where email = ?`, [newpassword,email],function(err){
                                    if(err){
                                        reject(err);
                                    }
                                });
                                this._smallUpdate(email,name,surname,uploadmode).then(
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
                    this._smallUpdate(email,name,surname,uploadmode);
                    resolve(true);
                } 
            });
            
        },
        addOnedriveRefreshToken :function(email,token){
            this.db.run(`UPDATE user SET ort = ? where email = ?`, [token,email],function(err){
                if(err){
                    console.log(err);
                }
            });
        },
        addGoogleRefreshToken :function(email,token){
            this.db.run(`UPDATE user SET grt = ? where email = ?`, [token,email],function(err){
                if(err){
                    console.log(err);
                }
            });
        },
        addDropboxRefreshToken :function(email,token){
            this.db.run(`UPDATE user SET drt = ? where email = ?`, [token,email],function(err){
                if(err){
                    console.log(err);
                }
            });
        }
    
    };
    return obj;
}

module.exports={
    "CreateUserModel":UserModel
};