var sq3 = require('sqlite3');
var config = require('./config');


function DataBase(){
    var obj={
    db : new sq3.Database(config['dbpath']),
    closeDatabase:function() {
        this.db.close();
    },

    createTable:function() {
          this.db.run('CREATE TABLE user(email text, password text, name text , surname text , uploadmode text, first text , second text , third text)');
          this.db.run('CREATE TABLE user_onedrive_files(email text, fisier text , id_fisier text )');
          this.db.run('CREATE TABLE uploaded_files(file_name,size,chunks,user_email)');
        
        // this.db.run('INSERT INTO user(email,password,name,surname) values (?,?,?,?)',["admin.admin@admins.com",'parola',"Adminu","Adminelu"],(err)=>{
        //     if (err) {
        //         return console.log(err.message);
        //     }
        //     else{
        //         console.log(`A row has been inserted with rowid ${this.lastID}`);
        //     }
        // });
        this.db.run(`INSERT INTO uploaded_files(file_name,size,chunks,user_email) VALUES(?,?,?,?)`, ["fisierul1", "mare", "chunk1 chunk2 chunk3 chunk4 chunk5 chunk6 chunk7" , 'paul_man70@yahoo.com'], (err)=> {
            if (err) {
              return console.log(err.message);
            }
            else{
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
        });
        this.db.run(`INSERT INTO uploaded_files(file_name,size,chunks,user_email) VALUES(?,?,?,?)`, ["fisierul2", "mediu", "chunk1 chunk2 chunk3 chunk4" , 'paul_man70@yahoo.com'], (err)=> {
            if (err) {
              return console.log(err.message);
            }
            else{
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
        });
        this.db.run(`INSERT INTO uploaded_files(file_name,size,chunks,user_email) VALUES(?,?,?,?)`, ["fisierul3", "mic", "chunk1 chunk2 chunk3" , 'paul_man70@yahoo.com'], (err)=> {
            if (err) {
              return console.log(err.message);
            }
            else{
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
        });
        this.db.run(`INSERT INTO uploaded_files(file_name,size,chunks,user_email) VALUES(?,?,?,?)`, ["fisierul4", "mediu", "chunk1 chunk2 chunk3 chunk4 chunk5 chunk6" , 'paul_man7@yahoo.com'], (err)=> {
            if (err) {
              return console.log(err.message);
            }
            else{
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
        });
        this.db.run(`INSERT INTO uploaded_files(file_name,size,chunks,user_email) VALUES(?,?,?,?)`, ["fisierul5", "mic", "chunk1 chunk2 " , 'paul_man0@yahoo.com'], (err)=> {
            if (err) {
              return console.log(err.message);
            }
            else{
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
        });
    },
    
    dropTable:function() {
        let db = new sq3.Database(config['dbpath']);
        db.run('drop TABLE user');
        db.run('drop table user_onedrive_files');
        db.run('drop table uploaded_files');
        db.close();
    }

    
};

return obj;

}

module.exports={
    "DataBase":DataBase
};