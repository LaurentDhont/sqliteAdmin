const Database = require('better-sqlite3');
const path = require('path');

function getRecentQuerys() {
    const db = new Database(path.join(__dirname, "../config/internalDb.db"));

    const sqlGetRecent = db.prepare("SELECT query FROM querys ORDER BY id DESC LIMIT 7 ");
    sqlGetRecent.raw(true);
    const querys = sqlGetRecent.all();
    db.close();
    return querys;
}

function insertMany(querys) {
    const db = new Database(path.join(__dirname, "../config/internalDb.db"));

    const sqlInsert = db.prepare("INSERT INTO querys (query) VALUES (?)");

    for (let i = 0; i < querys.length ;i++) {
        sqlInsert.run(querys[i]);
    }
    db.close();
}

exports.insertMany = insertMany;
exports.getRecentQuerys = getRecentQuerys;
