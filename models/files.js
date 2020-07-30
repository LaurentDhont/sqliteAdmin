const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const formatters = require('../util/formatters');

const config = require('./config');

async function crawl(directory, subDirectories, extensions, filesArray) {
    const dirs = await fsPromises.readdir(directory, {
        withFileTypes: true
    });


    for (let i = 0; i < dirs.length; i++) {
        const currentDir = dirs[i];
        const newPath = path.join(directory, currentDir.name);


        if (subDirectories) {
            if (currentDir.isDirectory()) {
                await crawl(newPath, subDirectories, extensions, filesArray);
            }
            else {
                const splitFileName = currentDir.name.split('.');
                if (extensions.includes(splitFileName[splitFileName.length - 1])) {
                    const stat = await fsPromises.stat(newPath);
                    filesArray.push({
                        name: currentDir.name,
                        directory: directory,
                        size: Math.floor(stat.size / 10) / 100,
                        lastModified: formatters.formatDate(stat.mtime),
                        location: newPath
                    });
                }
            }
        }

        else if (currentDir.isFile()) {
            const splitFileName = currentDir.name.split('.');
            if (extensions.includes(splitFileName[splitFileName.length - 1])) {
                const stat = await fsPromises.stat(newPath);
                filesArray.push({
                    name: currentDir.name,
                    directory: directory,
                    size: Math.floor(stat.size / 10) / 100,
                    lastModified: formatters.formatDate(stat.mtime),
                    location: newPath
                });
            }
        }
    }

    return filesArray;
}

async function getAll () {
    const directory = await config.getDirectory();
    const extensions = await config.getExtensions();
    let subDirectories = await config.getSubDirectories();

    subDirectories = subDirectories === "true";

    let filesArray = [];
    await crawl(directory, subDirectories, extensions, filesArray);
    return filesArray;
}

exports.getAll = getAll;
