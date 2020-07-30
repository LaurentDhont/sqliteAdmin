let actions = ["SELECT", "UPDATE", "INSERT OR IGNORE INTO", "INSERT INTO", "DELETE"];
let actionsBeforeTables = ["UPDATE", "INSERT OR IGNORE INTO", "INSERT INTO"];

let tables = [
    {
        name: "EXTDIR",
        columns: ["ROWID", "LangID", "Dir", "Subtag", "FullName"]
    },
    {
        name: "SCALE",
        columns: ["ROWID", "rowid", "Label", "Description"]
    },
    {
        name: "META",
        columns: ["ROWID", "Freelancer", "Generated", "Delivered", "Currency"]
    }
];


let sqlInput = $("#sqlInput");

let query = [];

sqlInput.autocomplete({
    source: ({term}, res) => {
        const wordLength = term.split(' ').length;
        const valueOfInput = sqlInput.val().toUpperCase();
        const startIndex = valueOfInput.lastIndexOf(' ') + 1;
        const previousWord = valueOfInput.slice(0, startIndex);
        const searchValue = valueOfInput.slice(startIndex, valueOfInput.length).toUpperCase();

        if (previousWord.length < 1) {
            res(actions.filter((value) => {
                if (value.startsWith(valueOfInput)) {
                    return value;
                }
            }));
        }
        else {
            let isUpdate = valueOfInput.startsWith("UPDATE");
            let isInsert = valueOfInput.startsWith("INSERT");
            let isSelect = valueOfInput.startsWith("SELECT");
            let isDelete = valueOfInput.startsWith("DELETE");

            if (isUpdate) {
                let tableName;
                if (wordLength > 3) {
                    tableName = valueOfInput.slice(7, valueOfInput.indexOf("SET") - 1);
                }

                if (wordLength === 2) {
                    res(tables.filter((value) => {
                        const tableName = value.name;
                        if (tableName.startsWith(searchValue)) {
                            return tableName;
                        }
                    }).map((value) => {
                        return value.name;
                    }));
                }
                else if (wordLength === 3) {
                    res(["SET"]);
                }
                else if (wordLength === 4) {
                    let columnRows = [];
                    for (let i = 0; i < tables.length; i++) {
                        if (tables[i].name === tableName) {
                            const columns = tables[i].columns;
                            for (let i = 0; i < columns.length; i++) {
                                if (columns[i].startsWith(searchValue)) {
                                    columnRows.push(columns[i]);
                                }
                            }
                        }
                    }
                    res(columnRows);
                }
                else if (wordLength === 5) {
                    res(["="]);
                }
                else if (wordLength > 6) {
                    console.log(previousWord.trim()[previousWord.trim().length - 1]);
                    if (previousWord.trim()[previousWord.trim().length -1 ]  === ",") {
                        let columnRows = [];
                        for (let i = 0; i < tables.length; i++) {
                            if (tables[i].name === tableName) {
                                const columns = tables[i].columns;
                                for (let i = 0; i < columns.length; i++) {
                                    if (columns[i].startsWith(searchValue)) {
                                        columnRows.push(columns[i]);
                                    }
                                }
                            }
                        }
                        res(columnRows);
                    }
                    else {
                        res(["WHERE"]);
                    }
                }
            }
        }
    },
    position: {
        my: "left bottom",
        at: "left top",
        collision: "none"
    },
    delay: 0,
    autoFocus: true,
    minLength: 0,
    select: (event, ui) => {
        event.preventDefault();
        const value = sqlInput.val();
        const startIndex = value.lastIndexOf(' ') + 1;
        const start = value.slice(0, startIndex);
        const end = ui.item.value;
        sqlInput.val(start + end);
    },
    focus: (event, ui) => {
        event.preventDefault();
    }
});
/*

sqlInput.addEventListener("input", (evt) => {
    const value = sqlInput.value;
    console.log(value.trim().split(' '));
    if (value.trim().split(' ').length === 1) {
        //first word
        if ("SELECT".startsWith(value)) {
            console.log("select");
        }
        if ("UPDATE".startsWith(value)) {
            console.log("update");
        }
        if ("INSERT".startsWith(value)) {
            console.log("insert");
        }
        if ("DELETE".startsWith(value)) {
            console.log("delete");
        }
    }
});
*/
