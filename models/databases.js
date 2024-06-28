const Database = require('better-sqlite3-default-extensions-helper')(require('better-sqlite3'));
const path = require('path');
const internalDb = require('./internalDb');

function getOne(location) {
    const db = new Database(location, {
        fileMustExist: true
    });

    const sqlGetTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence'");
    let tables = sqlGetTables.all();

    for (let i = 0; i < tables.length; i++) {
        const sqlGetRecords = db.prepare("SELECT COUNT(*) AS records FROM " + tables[i].name);
        tables[i].records = sqlGetRecords.get().records;
    }

    const sqlGetViews = db.prepare("SELECT name FROM sqlite_master WHERE type='view'");
    let views = sqlGetViews.all();

    for (let i = 0; i < views.length; i++) {
        try {
            const sqlGetRecords = db.prepare("SELECT COUNT(*) AS records FROM " + views[i].name);
            views[i].records = sqlGetRecords.get().records;
        }
        catch (e) {
            console.error(e);
            views[i].records = "/";
        }

    }

    db.close();

    const splitLocation = location.split('/');

    return {
        name: splitLocation[splitLocation.length - 1],
        tables: tables,
        views: views,
        location: location
    }
}

function getTable(location, table, column, order, filter, quantity, page) {
    const db = new Database(location, {
        fileMustExist: true
    });

    const columns = db.pragma("table_info(" + table + ")", {simple: false});

    let pk;

    for (let i = 0; i < columns.length; i++) {
        if (columns[i].pk === 1) {
            pk = columns[i].name
        }
        columns[i].pk = columns[i].pk === 1;
    }

    let sqlGetRows;

    page *= quantity;

    if (pk) {
        if (column && order) {
            sqlGetRows = db.prepare("SELECT " + pk + " AS ROWID, * FROM " + table + " ORDER BY [" + column + "] " + order + " LIMIT " + page + ", " + quantity);
        }
        else if (column && filter) {
            sqlGetRows = db.prepare("SELECT " + pk + " AS ROWID, * FROM " + table + " WHERE [" + column + "] LIKE '%" + filter + "%' LIMIT " + page + ", " + quantity);
        }
        else {
            sqlGetRows = db.prepare("SELECT " + pk + " AS ROWID, * FROM " + table + " LIMIT " + page + ", " + quantity);
        }
    }
    else {
        if (column && order) {
            sqlGetRows = db.prepare("SELECT ROWID AS ROWID, * FROM " + table + " ORDER BY [" + column + "] " + order + " LIMIT " + page + ", " + quantity);
        }
        else if (column && filter) {
            sqlGetRows = db.prepare("SELECT ROWID AS ROWID, * FROM " + table + " WHERE [" + column + "] LIKE '%" + filter + "%' LIMIT " + page + ", " + quantity);
        }
        else {
            sqlGetRows = db.prepare("SELECT ROWID AS ROWID, * FROM " + table + " LIMIT " + page + ", " + quantity);
        }
    }

    let rows = sqlGetRows.all();

    let realRows = [];

    for (let i = 0; i < rows.length; i++) {
        let realRow = [];

        for (let key in rows[i]) {
            for (let j = 0; j < columns.length; j++) {
                if (key === columns[j].name) {
                    realRow.push({
                        value: rows[i][key],
                        column: columns[j],
                        isNull: rows[i][key] === null
                    });
                }
            }
        }
        realRows.push({
            row: realRow,
            ROWID: rows[i].ROWID
        });
    }

    const sql = db.prepare("SELECT sql FROM sqlite_master WHERE name = ?").get(table).sql;

    db.close();

    return {
        columns: columns,
        rows: realRows,
        pk: pk,
        name: table,
        sql: sql
    }
}

function getView(location, view, column, order, filter, quantity, page) {
    const db = new Database(location, {
        fileMustExist: true
    });

    const columns = db.pragma("table_info(" + view + ")", {simple: false});

    let sqlGetRows;

    if (column && order) {
        sqlGetRows = db.prepare("SELECT * FROM " + view + " ORDER BY [" + column + "] " + order);
    }
    else if (column && filter) {
        sqlGetRows = db.prepare("SELECT * FROM " + view + " WHERE [" + column + "] LIKE '%" + filter + "%'");
    }
    else {
        sqlGetRows = db.prepare("SELECT * FROM " + view);
    }

    page *= quantity;


    if (column && order) {
        sqlGetRows = db.prepare("SELECT  * FROM " + view + " ORDER BY [" + column + "] " + order + " LIMIT " + page + ", " + quantity);
    }
    else if (column && filter) {
        sqlGetRows = db.prepare("SELECT * FROM " + view + " WHERE [" + column + "] LIKE '%" + filter + "%' LIMIT " + page + ", " + quantity);
    }
    else {
        sqlGetRows = db.prepare("SELECT  * FROM " + view + " LIMIT " + page + ", " + quantity);
    }


    let rows = sqlGetRows.all();

    const sql = db.prepare("SELECT sql FROM sqlite_master WHERE name = ?").get(view).sql;

    db.close();

    return {
        columns: columns,
        rows: rows,
        name: view,
        sql: sql
    }
}

function deleteRow(location, table, rowId) {
    const db = new Database(location, {
        fileMustExist: true
    });

    const columns = db.pragma("table_info(" + table + ")", {simple: false});

    let pk;

    for (let i = 0; i < columns.length; i++) {
        if (columns[i].pk === 1) {
            pk = columns[i].name
        }
    }

    let sql = "DELETE FROM " + table + " WHERE ";

    if (pk) {
        sql += pk
    }
    else {
        sql += "ROWID"
    }

    sql += " = ?";

    const sqlDeleteRow = db.prepare(sql);
    sqlDeleteRow.run(rowId);

    db.close();
}

function deleteTable(location, table) {
    const db = new Database(location, {
        fileMustExist: true
    });

    const sqlDeleteTable = db.prepare("DROP TABLE " + table);
    sqlDeleteTable.run();

    db.close();
}

function deleteView(location, view) {
    const db = new Database(location, {
        fileMustExist: true
    });

    const sqlDeleteTable = db.prepare("DROP VIEW " + view);
    sqlDeleteTable.run();

    db.close();
}

function executeStatement(location, sql) {
    const db = new Database(location, {
        fileMustExist: true
    });

    const statements = sql.split(';').filter((value) => {
        if (value.trim().length > 0) {
            return value;
        }
    });

    let results = [];

    const transaction = db.transaction(() => {
        for (let i = 0; i < statements.length; i++) {
            statements[i] = db.prepare(statements[i].trim());

            if (statements[i].reader) {
                const columns = statements[i].columns();
                let table = null;
                if (columns.length > 0) {
                    table = columns[0].table;
                }
                results.push({
                    rows: statements[i].all(),
                    columns: columns.map((value) => {
                        return value.name;
                    }),
                    table: table,
                    query: statements[i].source
                });
            }
            else {
                results.push({
                    result: statements[i].run(),
                    query: statements[i].source
                });
            }
        }
    });
    transaction();



    internalDb.insertMany(statements.map((value) => {
        return value.source;
    }));

    db.close();

    return results;
}

function getColumns(location, table) {
    const db = new Database(location, {
        fileMustExist: true
    });

    const columns = db.pragma("table_info(" + table + ")", {simple: false});
    db.close();
    return columns;
}

const csv = require('fast-csv');

function exportTable (location, table, type, columnsToExport, columnNames, whereClause) {
    const db = new Database(location, {
        fileMustExist: true
    });

    let statement;

    if (columnsToExport) {
        let sql = "SELECT ";
        for (let i = 0; i < columnsToExport.length; i++) {
            sql+= columnsToExport[i];
            sql += " AS '" + columnNames[i] + "'";
            if (i !== columnsToExport.length - 1) {
                sql += ", ";
            }
        }
        sql += " FROM " + table;
        if (whereClause) {
            sql += " " + whereClause;
        }
        console.log(sql);

        statement = db.prepare(sql);
    }
    else {
        statement = db.prepare("SELECT * FROM " + table);
    }

    statement.raw(true);

    const filePath = path.join(__dirname, "../exportFiles/" + Math.random() + "-" + new Date().toString() + "." + type);


    let rows = statement.all();
    let columns = statement.columns();
    columns = columns.map((value) => {
        return value.name;
    });

    db.close();

    let delimiter = ",";

    if (type === "tsv") {
        delimiter = "\t";
    }

    return new Promise((resolve, reject) => {
        csv.writeToPath(filePath, rows, {
            headers: columns,
            delimiter: delimiter
        })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('finish', () => {
                console.log("finished");
                resolve(filePath);
            });
    });

}

function updateRow(location, table, column, ROWID, value) {
    const db = new Database(location, {
        fileMustExist: true
    });

    const columns = db.pragma("table_info(" + table + ")", {simple: false});

    let pk;

    for (let i = 0; i < columns.length; i++) {
        if (columns[i].pk === 1) {
            pk = columns[i].name
        }
    }

    console.log(column);

    let sql = "UPDATE " + table + " SET [" + column + "] = ? WHERE ";

    if (pk) {
        sql += pk;
    }
    else {
        sql += "ROWID";
    }

    sql += " = ?";

    const sqlUpdate = db.prepare(sql);
    const result = sqlUpdate.run(value, ROWID);

    db.close();
    return result;
}

function vacuum(location) {
    const db = new Database(location, {
        fileMustExist: true
    });

    db.exec('VACUUM;');

    db.close();
}

function vacuumTable(location, table) {
    const db = new Database(location, {
        fileMustExist: true
    });

    db.exec('VACUUM ' + table + ';');

    db.close();
}

function importTable(location, table, filePath, type) {
    const db = new Database(location, {
        fileMustExist: true
    });

    let sql = "INSERT INTO " + table + "(";
    let columnsSet = false;

    let delimiter = ",";

    if (type === "tsv") {
        delimiter = "\t";
    }

    return new Promise((resolve, reject) => {
        csv.parseFile(filePath, {
            headers: true,
            trim: false,
            delimiter: delimiter
        })
            .on('data', (row) => {
                if(!columnsSet) {
                    for (const column in row) {
                        sql+=column + ",";
                    }
                    sql = sql.slice(0, -1);

                    sql+= ") VALUES (";

                    row = Object.values(row);

                    for (let i = 0; i < row.length; i++) {
                        if (i === row.length - 1) {
                            sql+= "?)";
                        }
                        else {
                            sql+="?,";
                        }
                    }

                    sql = db.prepare(sql);
                    columnsSet = true;
                }
                row = Object.values(row);
                try {
                    sql.run(row);
                }
                catch (e) {
                    console.log(e);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', (rowcount) => {
                db.close();
                resolve(rowcount);
            });
    });
}

function cloneTable(location, table, name) {
    const db = new Database(location, {
        fileMustExist: true
    });

    let sqlCreateClone = db.prepare("CREATE TABLE " + name + " AS SELECT * FROM " + table);
    sqlCreateClone.run();
    db.close();
}

exports.cloneTable = cloneTable;
exports.import = importTable;
exports.vacuum = vacuum;
exports.vacuumTable = vacuumTable;
exports.updateRow = updateRow;
exports.export = exportTable;
exports.getTable = getTable;
exports.getView = getView;
exports.getOne = getOne;
exports.deleteRow = deleteRow;
exports.deleteTable = deleteTable;
exports.deleteView = deleteView;
exports.executeStatement = executeStatement;
exports.getColumns = getColumns;
