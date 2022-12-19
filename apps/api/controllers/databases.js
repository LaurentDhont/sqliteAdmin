const files = require("../../../models/files");
const crypto = require('crypto');

exports.getDatabases = async (req, res) => {
	const {search, page = 0} = req.query;

	try {
		let requestClosed = false;
		const abortController = new AbortController();

		console.log(search, page);

		req.on('close', () =>  {
			console.log("Closing request");
			requestClosed = true;
			abortController.abort();
		});

		const eventEmitter = await files.getAllEvents(search, abortController.signal);

		let count = 0;
		let quantity = 10;
		let countSend = 0;

		eventEmitter.on('file', (file) => {
			count ++;
			if (count > page * quantity) {
				// is this feasible long term? Because you have to re-fetch all the files from the fs for every page.
				// Is there any kind of tracer or cursor we can use to start off where we left off?

				file.id = crypto.randomUUID();
				res.write(JSON.stringify(file) + "\n");
				countSend ++;
				if (countSend >= quantity) {
					console.log(countSend, quantity);
					abortController.abort();
				}
			}
		});
		eventEmitter.on('finished', () => {
			console.log("Finished");
			!requestClosed && res.end();
		});
		eventEmitter.on('error', (error) => {
			console.error(error);
			!requestClosed && res.sendStatus(500);
		});
	}
	catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
};
