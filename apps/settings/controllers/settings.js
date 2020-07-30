const config = require('../../../models/config');

exports.get = async (req, res) => {
    let options = {
        title: "Settings",
        errors: req.session.errors
    };

    try {
        options.directory = await config.getDirectory();
    }
    catch (e) {
        console.error(e);
        options.errors.push("Something went wrong with getting the existing configuration for directory.");
    }

    try {
        const subdirectories = await config.getSubDirectories();
        options.subdirectories = subdirectories === "true";
    }
    catch (e) {
        console.error(e);
        options.errors.push("Something went wrong with getting the existing configuration for subdirectories.");
    }
    try {
        options.extensions = await config.getExtensions();
    }
    catch (e) {
        console.error(e);
        options.errors.push("Something went wrong with getting the existing configuration for extensions.");
    }
    try {
        options.type = await config.getType();
    }
    catch (e) {
        console.error(e);
        options.errors.push("Something went wrong with getting the existing configuration for export format.");
    }
    res.render('settings', options);
};

exports.post = async (req, res) => {
    const {directory , extensions, type} = req.body;

    let {subdirectories} = req.body;

    if (subdirectories === "on") {
        subdirectories = "true";
    }
    else {
        subdirectories = "false";
    }

    try {
        await config.setDirectory(directory);
    }
    catch (e) {
        console.error(e);
        req.session.errors.push("Failed to save directory in configuration.");
    }
    try {
        await config.setSubDirectories(subdirectories);
    }
    catch (e) {
        console.error(e);
        req.session.errors.push("Failed to save subdirectories in configuration.");
    }

    try {
        await config.setExtensions(extensions.split(','));
    }
    catch (e) {
        console.error(e);
        req.session.errors.push("Failed to save extensions in configuration.");
    }

    try {
        await config.setType(type);
    }
    catch (e) {
        console.error(e);
        req.session.errors.push("Failed to save export format in configuration.");
    }

    res.redirect('/settings');
};