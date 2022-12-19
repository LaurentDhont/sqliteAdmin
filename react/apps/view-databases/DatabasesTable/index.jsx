import TableHead from "./TableHead";
import TableBody from "./TableBody";
import Spinner from "../../../components/Spinner";

export default function DatabasesTable({databases, setDatabases, selectAll, setSelectAll, loading, lastDatabaseRef}) {
	return (
		<div className="table-responsive" id={"databasesTable"}>
			<table className="table table-striped">
				<caption>Databases</caption>
				<TableHead selectAll={selectAll} setSelectAll={setSelectAll}/>
				<TableBody setDatabases={setDatabases} lastDatabaseRef={lastDatabaseRef} databases={databases}/>
				{loading &&
					<tbody>
						<tr>
							<td colSpan={6}><Spinner /></td>
						</tr>
					</tbody>
				}
			</table>
		</div>
	);
}
