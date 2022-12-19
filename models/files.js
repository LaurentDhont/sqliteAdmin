const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const formatters = require('../util/formatters');

const config = require('./config');

async function crawl(directory, subDirectories, extensions, search, signal, eventEmitter) {
    const dirs = await fsPromises.readdir(directory, {
        withFileTypes: true
    });

    if (signal.aborted) {
        return;
    }

    for (let i = 0; i < dirs.length; i++) {
        const currentDir = dirs[i];
        const newPath = path.join(directory, currentDir.name);


        if (subDirectories) {
            if (currentDir.isDirectory()) {
                await crawl(newPath, subDirectories, extensions, search, signal, eventEmitter);
            } else {
                const splitFileName = currentDir.name.split('.');
                if (extensions.includes(splitFileName[splitFileName.length - 1])) {
                    const stat = await fsPromises.stat(newPath);
                    if (signal.aborted) {
                        return;
                    }

                    if ((search && currentDir.name.includes(search)) || !search) {
                        eventEmitter.emit('file', {
                            name: currentDir.name,
                            directory: directory,
                            size: Math.floor(stat.size / 10) / 100,
                            lastModified: formatters.formatDate(stat.mtime),
                            location: newPath
                        });
                    }
                }
            }
        } else if (currentDir.isFile()) {
            const splitFileName = currentDir.name.split('.');
            if (extensions.includes(splitFileName[splitFileName.length - 1])) {
                const stat = await fsPromises.stat(newPath);
                if (signal.aborted) {
                    return;
                }

                if ((search && currentDir.name.includes(search)) || !search) {
                    eventEmitter.emit('file', {
                        name: currentDir.name,
                        directory: directory,
                        size: Math.floor(stat.size / 10) / 100,
                        lastModified: formatters.formatDate(stat.mtime),
                        location: newPath
                    });
                }
            }
        }
    }
}

const events = require('events');

async function getAllEvents(search, signal) {
    const myEmitter = new events.EventEmitter();
    const directory = await config.getDirectory();
    const extensions = await config.getExtensions();
    const subDirectories = (await config.getSubDirectories()) === "true";

    crawl(directory, subDirectories, extensions, search, signal, myEmitter).then(() => {
        myEmitter.emit('finished');
    }).catch(e => {
        myEmitter.emit('error', e);
    });

    return myEmitter;
}

exports.getAllEvents = getAllEvents;
