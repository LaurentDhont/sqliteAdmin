export default function TableHead({selectAll, setSelectAll}) {
	return (
		<thead className="thead-dark">
			<tr>
				<th>Name</th>
				<th>Directory</th>
				<th>Last modified</th>
				<th>Size (kB)</th>
				<th>Actions</th>
				<th><input type="checkbox" value={selectAll} onChange={evt => {
					setSelectAll(evt.target.checked);
				}}/></th>
			</tr>
		</thead>
	);
}
