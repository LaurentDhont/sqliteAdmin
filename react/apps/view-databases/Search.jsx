
export default function Search({search, setSearch}) {
	return (
		<div className={"w-100"}>
			<input type="text" className="form-control" value={search} onChange={(evt) => {
				setSearch(evt.target.value);
			}} placeholder="Search database name" autoFocus={true} />
		</div>

	);
}
