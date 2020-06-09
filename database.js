var sq3 = require('sqlite3');
var config = require('./config');


function DataBase(){
    var obj={
    db : new sq3.Database(config['dbpath']),
    closeDatabase:function() {
        this.db.close();
    },

    createTable:function() {
        /*  this.db.run('CREATE TABLE user(email text, password text, name text , surname text , uploadmode text, grt text , ort text , drt text)');
          this.db.run('CREATE TABLE user_onedrive_files(email text, fisier text , id_fisier text )');
          this.db.run('CREATE TABLE uploaded_files(file_name,size,chunks,user_email)');
        */
        /* this.db.run('INSERT INTO user(email,password,name,surname) values (?,?,?,?)',["admin.admin@admins.com",'parola',"Adminu","Adminelu"],(err)=>{
             if (err) {
                 return console.log(err.message);
             }
             else{
                 console.log(`A row has been inserted with rowid ${this.lastID}`);
             }
         });*/
         this.db.run('UPDATE user set grt  = ? where email = ?',['1//03EGCLXIV5RcmCgYIARAAGAMSNwF-L9Ir0lewVpxq8fV60GthA8n-BRhG_8AuM9pAq9xIPHiscqWJbNEZ6KJHPzIe-eRu8-wHc6M','cosmin.ivanov@gmail.com']);
         this.db.run('UPDATE user set ort  = ? where email = ?',['MCUL7bxBrd0P3Ts0Y7xbyKWsx*Uq3tjUdLdx9LEI2!S!Ld2xOVwCBZ3NNpCS!P8vhduhWm8bWW8y*3mRFR5IgMA6H2fVMeM!*5eIBhxsntwuKap47ApcmHBaJ2FGf6gLS28v!l7cN2lu6iiSqaeOf1XdoLwa6nJShgcOBzB7N7yEfQQf09JAXpRKdTGOClptmoct0GMmeFzaNbIVZF*PpTXH89i6*RUCrBepzBKXUBq5z0xKktwpx7aWU9TK0lMH1QQ9831TmAtG0Kml1YEOX2E5CNO8vsoRxgko88EshkKawG7!Bp79Yt5LFzA!NEbJqIGGVZhgDznw!aieP6SW80Llc2H3xzq1eWDq2zQ7ePDo5m2k3yJld*y9W!1RMS6oOJQg6AAym79qCLghS!cYd1wGyfMeLGPAnVlR1aCdUNfjUd4JmEZeZz5gThI1srRh5hohqESRKSHPjCjAZYFLQjUE$','cosmin.ivanov@gmail.com']);
         this.db.run('UPDATE user set drt  = ? where email = ?',['BQOYyAxkcAkAAAAAAAAQl37oN9070rUptuQz_A7bz8p7Bkz2MbcNcq68LfFe6Pfm','cosmin.ivanov@gmail.com']);
        
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