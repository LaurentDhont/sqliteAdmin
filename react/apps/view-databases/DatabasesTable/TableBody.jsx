import TableRow from "./TableRow";

export default function TableBody({databases, setDatabases, lastDatabaseRef}) {
	return (
		<tbody id={"tbody"}>
		{databases.map((value, index) => {
			if (index === databases.length - 1) {
				return <TableRow setDatabases={setDatabases} key={value.id} ref={lastDatabaseRef} database={value}/>
			}
			else {
				return <TableRow setDatabases={setDatabases} key={value.id} database={value}/>;
			}
		})}
		</tbody>
	);
}
