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
        db.run('CREATE TABLE user(email text, password text, name text , surname text )');
        db.close();
    },
    
    dropTable:function() {
        let db = new sq3.Database(config['dbpath']);
        db.run('drop TABLE user');
        db.close();
    },
    
     insertUser :function(email, password, name, surname)  {
        // vezi ca s ar putea sa intri pe contul lui ma ta
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

    }
};

return obj;

}

module.exports={
    "DataBase":DataBase
};