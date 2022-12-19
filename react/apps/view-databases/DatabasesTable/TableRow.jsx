import {useRef, forwardRef} from "react";


const TableRow = forwardRef(({database, setDatabases, index}, ref) => {
	const getDatabaseForm = useRef();

	return (
		<tr className={"databaseRow"} ref={ref}>
			<td>
				<form ref={getDatabaseForm} action="/databases/getDatabase">
					<input type="hidden" name="location" value={database.location} />
					<a onClick={(evt) => {
						getDatabaseForm.current.submit();
					}} href="#">{database.name}</a>
				</form>
			</td>
			<td>{database.directory}</td>
			<td>{database.lastModified}</td>
			<td>{database.size}</td>
			<td>
				<form className="d-inline" action="/databases/download" method="get">
					<input type="hidden" name="location" value={database.location} />
					<button type="submit" className="btn btn-sm btn-success">Download</button>
				</form>
				<form className="d-inline" action="/databases/vacuum" method="post">
					<input type="hidden" name="location" value={database.location} />
					<button type="submit" className="btn btn-sm btn-primary">Vacuum</button>
				</form>
			</td>
			<th>
				<input type="checkbox" className="selectCheckBoxes" checked={database.checked} form="executeForm" name="dbs"
					   value={database.location} onChange={evt => {
							setDatabases(prevState => {
								const newState = [...prevState];
								newState[newState.findIndex(value => value.id === database.id)].checked = evt.target.checked;
								return newState;
							});
					   }}
				/>
				<input readOnly={true} hidden type="checkbox" className="selectCheckBoxes" checked={database.checked} form="executeForm" name="names"
					   value={database.name} />
			</th>
		</tr>
	);
});

export default TableRow;
