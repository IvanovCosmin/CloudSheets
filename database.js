var sq3 = require('sqlite3');
var config = require('./config');


function DataBase(){
    var obj={
    db : new sq3.Database(config['dbpath']),
    closeDatabase:function() {
        this.db.close();
    },

    createTable:function() {
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
