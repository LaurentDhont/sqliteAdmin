import { useEffect, useState } from 'react'

const quantity = 10;

export default function useDatabases(search, pageNumber, selectAll) {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [databases, setDatabases] = useState([])
	const [hasMore, setHasMore] = useState(false)

	useEffect(() => {
		setDatabases([]);
	}, [search]);

	useEffect(() => {
		const abortController = new AbortController();
		let isMounted = true;

		(async () => {
			setLoading(true);

			try {
				const urlSearchParams = new URLSearchParams();
				urlSearchParams.append('search', search);
				urlSearchParams.append('page', pageNumber);

				function splitStream(splitOn) {
					let buffer = '';

					return new TransformStream({
						transform(chunk, controller) {
							buffer += chunk;
							const parts = buffer.split(splitOn);
							parts.slice(0, -1).forEach(part => controller.enqueue(part));
							buffer = parts[parts.length - 1];
						},
						flush(controller) {
							if (buffer) {
								controller.enqueue(buffer);
							}
						}
					});
				}

				const response = await fetch(window.origin + "/api/v1/databases?" + urlSearchParams.toString(), {
					credentials: "include", // so that authentication middleware can work
					signal: abortController.signal
				});

				const reader = response.body.pipeThrough(new TextDecoderStream()).pipeThrough(splitStream("\n")).getReader();

				let done = false;
				let count = 0;

				while (!done && isMounted) {
					const data = await reader.read();
					done = data.done;
					if (!done) {
						count ++;
						isMounted && setDatabases(prevState => {
							return [...prevState, {
								...JSON.parse(data.value),
								checked: selectAll
							}];
						});
					}
				}

				isMounted && setHasMore(count >= quantity);
			}
			catch (e) {
				console.error(e);
			}
			finally {
				isMounted && setLoading(false);
			}
		})();

		return () => {
			abortController.abort();
			isMounted = false;
		}
	}, [search, pageNumber]);

	useEffect(() => {
		setDatabases(prevState => {
			return [...prevState.map(value => {
				return {
					...value,
					checked: selectAll
				};
			})];
		})
	}, [selectAll]);

	return { loading, error, databases, hasMore, setDatabases }
}
