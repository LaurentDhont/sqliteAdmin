const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const configFile = path.join(__dirname, "../config/config.conf");

async function getDirectory(){
    const contents = await fsPromises.readFile(configFile, {
        encoding: "utf8"
    });
    const rows = contents.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const currentRow = rows[i].split("=");
        const variable = currentRow[0];
        if (variable === "directory") {
            return currentRow[1];
        }
    }
}

async function getSubDirectories() {
    const contents = await fsPromises.readFile(configFile, {
        encoding: "utf8"
    });
    const rows = contents.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const currentRow = rows[i].split("=");
        const variable = currentRow[0];
        if (variable === "subdirectories") {
            return currentRow[1];
        }
    }
}

async function getExtensions() {
    const contents = await fsPromises.readFile(configFile, {
        encoding: "utf8"
    });
    const rows = contents.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const currentRow = rows[i].split("=");
        const variable = currentRow[0];
        if (variable === "extensions") {
            let extensions = currentRow[1].split(',');
            extensions = extensions.map((value) => {
                return value.trim();
            });
            return extensions;
        }
    }
}

async function getPassword() {
    const contents = await fsPromises.readFile(configFile, {
        encoding: "utf8"
    });
    const rows = contents.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const currentRow = rows[i].split("=");
        const variable = currentRow[0];
        if (variable === "password") {
            return currentRow[1];
        }
    }
}

async function getType() {
    const contents = await fsPromises.readFile(configFile, {
        encoding: "utf8"
    });
    const rows = contents.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const currentRow = rows[i].split("=");
        const variable = currentRow[0];
        if (variable === "type") {
            return currentRow[1].trim();
        }
    }
}

async function setDirectory(directory) {
    const contents = await fsPromises.readFile(configFile, {
        encoding: "utf8"
    });
    let newContents = "";

    const rows = contents.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const currentRow = rows[i].split("=");
        const variable = currentRow[0];
        if (variable === "directory") {
            if (i === rows.length - 1) {
                newContents+=variable + "=" + directory;
            }
            else {
                newContents+=variable + "=" + directory + "\n";
            }
        }
        else {
            if (i === rows.length - 1) {
                newContents+=rows[i];
            }
            else {
                newContents+=rows[i] + "\n";
            }
        }
    }

    await fsPromises.writeFile(configFile, newContents, {
        encoding: "utf8"
    });
}

async function setSubDirectories(subdirectories) {
    const contents = await fsPromises.readFile(configFile, {
        encoding: "utf8"
    });
    let newContents = "";

    const rows = contents.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const currentRow = rows[i].split("=");
        const variable = currentRow[0];
        if (variable === "subdirectories") {
            if (i === rows.length - 1) {
                newContents+=variable + "=" + subdirectories;
            }
            else {
                newContents+=variable + "=" + subdirectories + "\n";
            }
        }
        else {
            if (i === rows.length - 1) {
                newContents+=rows[i];
            }
            else {
                newContents+=rows[i] + "\n";
            }
        }
    }

    await fsPromises.writeFile(configFile, newContents, {
        encoding: "utf8"
    });
}

async function setExtensions(extensions) {
    extensions = extensions.map((value) => {
        return value.trim();
    });

    const contents = await fsPromises.readFile(configFile, {
        encoding: "utf8"
    });
    let newContents = "";

    const rows = contents.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const currentRow = rows[i].split("=");
        const variable = currentRow[0];
        if (variable === "extensions") {
            if (i === rows.length - 1) {
                newContents+=variable + "=" + extensions;
            }
            else {
                newContents+=variable + "=" + extensions + "\n";
            }
        }
        else {
            if (i === rows.length - 1) {
                newContents+=rows[i];
            }
            else {
                newContents+=rows[i] + "\n";
            }
        }
    }

    await fsPromises.writeFile(configFile, newContents, {
        encoding: "utf8"
    });
}

async function setType(type) {
    const contents = await fsPromises.readFile(configFile, {
        encoding: "utf8"
    });
    let newContents = "";

    const rows = contents.split('\n');
    for (let i = 0; i < rows.length; i++) {
        const currentRow = rows[i].split("=");
        const variable = currentRow[0];
        if (variable === "type") {
            if (i === rows.length - 1) {
                newContents+=variable + "=" + type;
            }
            else {
                newContents+=variable + "=" + type + "\n";
            }
        }
        else {
            if (i === rows.length - 1) {
                newContents+=rows[i];
            }
            else {
                newContents+=rows[i] + "\n";
            }
        }
    }

    await fsPromises.writeFile(configFile, newContents, {
        encoding: "utf8"
    });
}

exports.setSubDirectories = setSubDirectories;
exports.setDirectory = setDirectory;
exports.setExtensions = setExtensions;
exports.setType = setType;

exports.getType = getType;
exports.getExtensions = getExtensions;
exports.getDirectory = getDirectory;
exports.getSubDirectories = getSubDirectories;
exports.getPassword = getPassword;