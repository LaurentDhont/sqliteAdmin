import * as React from "react";
import ReactDOM from "react-dom/client";
import {useCallback, useEffect, useRef, useState} from "react";
import Spinner from "../../components/Spinner";
import Search from "./Search";
import DatabasesTable from "./DatabasesTable";
import useDatabases from "./hooks/useDatabases";
import ExecuteStatements from "./ExecuteStatements";

const container = document.getElementById("container");

const App = () => {
	const [search, setSearch] = useState('');
	const [pageNumber, setPageNumber] = useState(0);
	const [selectAll, setSelectAll] = useState(false);

	const {databases, hasMore, loading, error, setDatabases} = useDatabases(search, pageNumber, selectAll);

	const observer = useRef();
	const prevLast = useRef();

	const lastDatabaseRef = useCallback(node => {
		if (!loading) {
			if (observer.current) {
				observer.current.disconnect();
			}
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber(prevPageNumber => prevPageNumber + 1);
				}
			});
			if (node) {
				observer.current.observe(node);
				prevLast.current = node;
			}
		}
		else if (prevLast.current) {
			prevLast.current.scrollIntoView(false); // to prevent infinite scrolling when scrollbar is at the bottom.
		}
	}, [loading, hasMore]);


	useEffect(() => {
		setPageNumber(0); // reset page when new search is entered
	}, [search]);

	useEffect(() => {
		/*const selectCheckBoxes = document.getElementsByClassName("selectCheckBoxes");
		selectAll.addEventListener("click", (evt) => {
			for (let i = 0; i < selectCheckBoxes.length; i++) {
				if (!selectCheckBoxes[i].parentElement.parentElement.classList.contains("d-none")){
					selectCheckBoxes[i].checked = selectAll.checked;
				}
			}
		});*/
	}, [selectAll]);

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-2">
				<Search search={search} setSearch={setSearch}/>
				<ExecuteStatements />
			</div>
			<DatabasesTable selectAll={selectAll} setDatabases={setDatabases} setSelectAll={setSelectAll} loading={loading} databases={databases} lastDatabaseRef={lastDatabaseRef}/>
		</>
	);
}

const root = ReactDOM.createRoot(container);
root.render(<React.StrictMode><App /></React.StrictMode>);
