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
        db.run('CREATE TABLE user(username text, email text, password text)');
        db.close();
    },
    
    dropTable:function() {
        let db = new sq3.Database(config['dbpath']);
        db.run('drop TABLE user');
        db.close();
    },
    
     insertUser :function(username, email, password)  {
        this.db.run(`INSERT INTO user(username, email, password) VALUES(?,?,?)`, [username, email,password], function(err) {
            if (err) {
              return console.log(err.message);
            }
            
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    },
    
    
    // example of function inside a promise
     getUserByUsername  :function(username)  {
        return new Promise((resolve, reject) => {
            let result = [];
            this.db.each(`select * from user where username='${username}' LIMIT 1;`, (err, row) => {
                if(err) { reject(err); }
                result.push(row);
                console.log(row);
            }, () => {
                resolve(result);
            });
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

    }
};

return obj;

}

module.exports={
    "DataBase":DataBase
};