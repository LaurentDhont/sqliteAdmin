
export default function ExecuteStatements() {
	return (
		<>
			<div className="text-nowrap ml-2">
				<button type="submit" className="btn btn-warning" data-toggle="modal" data-target="#executeModal">Execute
					queries for all selected dbs
				</button>
			</div>

			<div className="modal fade" id="executeModal" tabIndex="-1" role="dialog" aria-labelledby="modalTitle"
				 aria-hidden="true">
				<div className="modal-dialog " role="document">
					<form action="/databases/executeStatements" method="post" id="executeForm">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="modalTitle">Execute queries</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="form-group">
									<label htmlFor="sqlInput">SQL statement('s)</label>
									<textarea name="sql" id="sqlInput" rows="10" placeholder="SQL statement('s) to execute"
											  className="form-control" required></textarea>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
								<button type="submit" className="btn btn-primary">Execute</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
