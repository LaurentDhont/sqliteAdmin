const files = require('../../../models/files');
const databases = require('../../../models/databases');
const config = require('../../../models/config');
const internalDb = require('../../../models/internalDb');

exports.getAll = async (req, res) => {
    let options = {
        title: "Databases",
        errors: req.session.errors,
        results : req.session.queryResults
    };

    req.session.queryResults = null;
    req.session.errors = [];

    try {
        options.databases = await files.getAll();
    }
    catch (e) {
        console.error(e);
        options.errors.push(e.message);
    }

    res.render('databases', options);
};

exports.getDatabase = async (req, res) => {
    let options = {
        errors: req.session.errors,
        queryResult: req.session.queryResult,
        query: req.session.query
    };

    req.session.queryResult = null;
    req.session.errors = [];

    const {location, active} = req.query;

    options.sqlActive = active === "sql";

    console.log(location, active);

    try {
        options.database = databases.getOne(location);
        options.database.location = encodeURIComponent(options.database.location);
    }
    catch (e) {
        console.error(e);
        options.errors.push(e.message);
    }

    try {
        const exportFormat = await config.getType();
        if (exportFormat === "csv") {
            options.csv = true;
        }
        else if (exportFormat === "tsv"){
            options.tsv = true;
        }
    }
    catch (e) {
        console.error(e);
        options.errors.push("Failed to get your preferred export format.");
    }

    try {
        options.querys = internalDb.getRecentQuerys();
    }
    catch (e) {
        console.error(e);
        options.errors.push("Failed to get your recent executed query's.");
    }
    res.render('database', options);
};

exports.generateStatement = (req, res) => {
    const {location, table: tableName, type, where} = req.query;

    try {
        const columns = databases.getColumns(location, tableName);

        let statement;
        if (type === "select") {
            statement = "SELECT \n";
            for (let i = 0; i < columns.length; i++) {
                statement += "[" + columns[i].name + "]";
                if (i !== columns.length - 1) {
                    statement+=", ";
                }
                statement += "\n";
            }
            statement += " FROM " + tableName;
        }
        else if (type === "insert") {
            statement = "INSERT INTO " + tableName + " (\n";
            for (let i = 0; i < columns.length; i++) {
                statement += "[" + columns[i].name + "]";
                if (i !== columns.length - 1) {
                    statement+=", ";
                }
                statement += "\n";
            }

            statement += ") \nVALUES(\n";
            for (let i = 0; i < columns.length; i++) {
                statement += "?";
                if (i !== columns.length - 1) {
                    statement+=", ";
                }
                statement += "\n";
            }
            statement += ")";
        }
        else if (type === "update") {
            statement = "UPDATE " + tableName + " SET \n";
            for (let i = 0; i < columns.length; i++) {
                statement += "[" + columns[i].name + "] = ?";
                if (i !== columns.length - 1) {
                    statement+=", ";
                }
                statement += "\n";
            }
        }
        if (where === 'true') {
            statement += " WHERE \n";
            for (let i = 0; i < columns.length; i++) {
                statement += "[" + columns[i].name + "] = ?";
                if (i !== columns.length - 1) {
                    statement += "\nAND\n";
                }
            }
        }

        res.send(statement);
    }
    catch (e) {
        console.error(e);
        res.send(e.message);
    }
};

exports.getTable = (req, res) => {
    let options = {
        errors: req.session.errors,
        fromExport: req.query.fromExport,
        whereClause: req.session.whereClause
    };

    req.session.whereClause = null;
    req.session.errors = [];

    const {location, table, column, order, filter} = req.query;
    let {quantity, page} = req.query;

    options.column = column;
    options.order = order;
    options.filter = filter;

    try {
        if (!quantity) {
            if (req.session.quantity) {
                quantity = req.session.quantity;
            }
            else {
                quantity = 25;
            }
        }
        if (!page) {
            page = 0;
        }

        if (quantity == 25) {
            options.is25 = true;
        }
        else if (quantity == 50) {
            options.is50 = true;
        }
        else if (quantity == 100) {
            options.is100 = true;
        }
        else if (quantity == 200) {
            options.is200 = true;
        }

        options.page = page;

        if (page == 0) {
            options.disabledPrevious = true;
        }

        req.session.quantity = quantity;

        options.database = databases.getOne(location);
        options.database.location = encodeURIComponent(options.database.location);

        for (let i = 0; i < options.database.tables.length; i++) {
            if (options.database.tables[i].name === table) {
                const records = options.database.tables[i].records;
                const maxPage = Math.round(records / quantity - 1);

                if (page >= maxPage) {
                    options.disableNext = true;
                }
            }
        }

        if (!options.disableNext) {
            options.nextPage = parseInt(page) + 1;
        }
        if (!options.disablePrevious) {
            options.previousPage = parseInt(page) - 1;
        }

        options.table = databases.getTable(location, table, column, order, filter, quantity, page);

        if (column && order) {
            if (column === "ROWID") {
                options.selected = true;
                options.ASC = order === "ASC";
            }
            for (let i = 0; i < options.table.columns.length; i++) {
                if (column === options.table.columns[i].name) {
                    options.table.columns[i].selected = true;
                    options.table.columns[i].ASC = order === "ASC";
                }
            }
        }

        // console.log(options.table.columns);

    }
    catch (e) {
        console.error(e);
        options.errors.push(e.message);
    }

    res.render('table', options);
};

exports.getView =  (req, res) => {
    let options = {
        errors: req.session.errors
    };

    req.session.errors = [];

    const {location, view, column, order, filter} = req.query;
    let {quantity, page} = req.query;

    options.column = column;
    options.order = order;
    options.filter = filter;

    try {
        if (!quantity) {
            if (req.session.quantity) {
                quantity = req.session.quantity;
            }
            else {
                quantity = 25;
            }
        }
        if (!page) {
            page = 0;
        }

        if (quantity == 25) {
            options.is25 = true;
        }
        else if (quantity == 50) {
            options.is50 = true;
        }
        else if (quantity == 100) {
            options.is100 = true;
        }
        else if (quantity == 200) {
            options.is200 = true;
        }

        options.page = page;

        if (page == 0) {
            options.disabledPrevious = true;
        }

        req.session.quantity = quantity;

        options.database = databases.getOne(location);
        options.database.location = encodeURIComponent(options.database.location);

        for (let i = 0; i < options.database.views.length; i++) {
            if (options.database.views[i].name === view) {
                const records = options.database.views[i].records;
                const maxPage = Math.round(records / quantity - 1);

                console.log(maxPage);

                if (page >= maxPage) {
                    options.disableNext = true;
                }
            }
        }

        if (!options.disableNext) {
            options.nextPage = parseInt(page) + 1;
        }
        if (!options.disablePrevious) {
            options.previousPage = parseInt(page) - 1;
        }

        options.view = databases.getView(location, view, column, order, filter, quantity, page);

        if (column && order) {
            if (column === "ROWID") {
                options.selected = true;
                options.ASC = order === "ASC";
            }
            for (let i = 0; i < options.view.columns.length; i++) {
                if (column === options.view.columns[i].name) {
                    options.view.columns[i].selected = true;
                    options.view.columns[i].ASC = order === "ASC";
                }
            }
        }
    }
    catch (e) {
        console.error(e);
        options.errors.push(e.message);
    }

    res.render('view', options);
};

exports.deleteRow =  (req, res) => {
    const {rowId, location, table} = req.body;

    try {
        databases.deleteRow(location, table, rowId);
    }
    catch (e) {
        console.error(e);
        req.session.errors.push(e.message);
    }

    res.redirect('/databases/getTable?location=' + location + "&table=" + table);
};

exports.deleteTable =  (req, res) => {
    const {location, table} = req.body;

    try {
        databases.deleteTable(location, table);
    }
    catch (e) {
        console.error(e);
        req.session.errors.push(e.message);
    }

    res.redirect('/databases/getDatabase?location=' + location);
};

exports.deleteView =  (req, res) => {
    const {location, view} = req.body;

    try {
        databases.deleteView(location, view);
    }
    catch (e) {
        console.error(e);
        req.session.errors.push(e.message);
    }

    res.redirect('/databases/getDatabase?location=' + location);
};

exports.executeStatement =  (req, res) => {
    let {location, sql} = req.body;

    sql = sql.trim();
    req.session.query = sql;

    try {
        req.session.queryResult = databases.executeStatement(location, sql);
    }
    catch (e) {
        console.error(e);
        req.session.errors.push(e.message);
    }

    res.redirect('/databases/getDatabase?location=' + location + "&active=sql");
};

exports.executeStatements =  (req, res) => {
    let {dbs, names, sql} = req.body;

    sql = sql.trim();

    try {
        let results = [];
        for (let i = 0; i < dbs.length; i++) {
            try {
                results.push(databases.executeStatement(dbs[i], sql));
            }
            catch (e) {
                console.error(e);
                req.session.errors.push(names[i] + ": "+ e.message);
            }
        }
        req.session.queryResults = results;
    }
    catch (e) {
        console.error(e);
        req.session.errors.push(e.message);
    }

    res.redirect('/databases');
};

exports.download = (req, res) => {
    let {location} = req.query;

    try {
        res.download(location);
    }
    catch (e) {
        console.log(e);
    }
};

exports.export =  (req, res) => {
    const {location, table, type, columns, columnNames, whereClause} = req.body;

    try {
        const file = databases.export(location, table, type, columns, columnNames, whereClause);
        console.log(file);
        res.download(file, table + "." + type);
    }
    catch (e) {
        console.error(e);
        req.session.errors.push(e.message);

        if (columns) {
            req.session.whereClause = whereClause;
            res.redirect('/databases/getTable?location='+location + "&table=" + table + "&fromExport=true");
        }
        else {
            res.redirect('/databases/getDatabase?location=' + location);
        }
    }
};

exports.updateRow =  (req, res) => {
    const {location, table, column, ROWID, value} = req.body;

    try {
        const result = databases.updateRow(location, table, column, ROWID, value);
        res.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        res.status(400).send(e.message);
    }
};

exports.vacuum =  (req, res) => {
    const {location} = req.body;

    try {
        databases.vacuum(location);
    }
    catch (e) {
        console.error(e);
        req.session.errors.push(e.message);
    }

    res.redirect('/databases');
};

exports.cloneTable =  (req, res) => {
    const {location, table, name} = req.body;

    try {
        databases.cloneTable(location, table, name);
    }
    catch (e) {
        console.error(e);
        req.session.errors.push(e.message);
    }
    res.redirect('/databases/getDatabase?location=' + location);
};

const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../../importFiles"))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype !== 'text/tab-separated-values' && file.mimetype !== "text/csv") {
        cb(new Error("TSV & CSV are the only files accepted."), false);

    }
    else {
        cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('file');

exports.import =  (req, res) => {
    upload(req, res,  (err) => {
        const {location, table} = req.body;

        if (err) {
            req.session.errors.push(err.message);
        }
        else {
            const file = req.file;

            let type;

            if (file.mimetype === "text/csv") {
                type = "csv";
            }
            else if (file.mimetype === "text/tab-separated-values") {
                type = "tsv";
            }
            try {
                databases.import(location, table, file.path, type);
            }
            catch (e) {
                console.error(e);
                req.session.errors.push(e.message);
            }
        }

        res.redirect('/databases/getDatabase?location=' + location);
    });
};
