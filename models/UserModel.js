var sq3 = require('sqlite3');
var config = require('../config');

function UserModel(db){
    var obj={
        db:db,
        insertUser :function(email, password, name, surname)  {
            this.db.run(`INSERT INTO user(email, password, name, surname , uploadmode , first ,second ,third) VALUES(?,?,?,?,?,?,?,?)`, [email, password, name, surname , 'Smart Sheet' , 'Google Drive' , 'Onedrive' , 'Dropbox'], (err)=> {
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
        _smallUpdate :function(email,name,surname,uploadmode,first,second,third){
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
                            console.log(user);
                            console.log(email);
                            if(oldpassword==user[0].password){
                                this.db.run(`UPDATE user SET password = ? where email = ?`, [newpassword,email],function(err){
                                    if(err){
                                        reject(err);
                                    }
                                });
                                this._smallUpdate(email,name,surname,uploadmode,first,second,third).then(
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
                    this._smallUpdate(email,name,surname,uploadmode,first,second,third);
                    resolve(true);
                } 
            });
            
        }
    
    };
    return obj;
}

module.exports={
    "CreateUserModel":UserModel
};