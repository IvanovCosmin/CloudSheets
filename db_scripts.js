// In this module all needed db functions must created
// To be taken into consideration is that in node the methods that are called
// on the db object are async so they must be wrapped in a promise.


//TODO redenumit fisier
//TODO acum sunt sanse sa se piarda date. facut obiect separat db care sa mentina conexiunea deschisa si sa o inchida la process.on('SIGINT', callback)
var sq3 = require('sqlite3');
var config = require('./config');



function createTable() {
    let db = new sq3.Database(config['dbpath']);
    db.run('CREATE TABLE user(username text, email text)');
    db.close();
}

function insertUser(username, email) {
    let db = new sq3.Database(config['dbpath']);
    db.run(`INSERT INTO user(username, email) VALUES(?,?)`, [username, email], function(err) {
        if (err) {
          return console.log(err.message);
        }
        
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
     
    db.close();
}


// example of function inside a promise
const getUserByUsername = (username) => {
    let db = new sq3.Database(config['dbpath']);
    
    return new Promise((resolve, reject) => {
        let result = [];
        db.each(`select * from user where username='${username}' LIMIT 1;`, (err, row) => {
            if(err) { reject(err); }
            result.push(row);
            console.log(row);
        }, () => {
            resolve(result);
        });
    });
}

const getAllUsers = () => {
    let db = new sq3.Database(config['dbpath']);

    return new Promise((resolve,reject)=>{
        let result=[];
        db.each('select * from user;',(err,row) =>{
            if(err) {reject(err);}
            result.push(row);
            
        } , () => {
            resolve(result);
        })
    })
}

// createTable();  //async, will not work with insert at the same time if not waited for. use a promise
// insertUser("Cosmin", "co@gm.com");
// insertUser("Paul", "pl@gm.com");
// insertUser("Tavi", "tv@gm.com");
// insertUser("Ioana", "io@gm.com");


module.exports = {
    "insertUser": insertUser,
    "getUserByUsername": getUserByUsername,
    "getAllUsers" : getAllUsers
};