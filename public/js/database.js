const browseButton = document.getElementById("browse-tab");
const sqlButton = document.getElementById("sql-tab");

browseButton.addEventListener("click", (evt) => {
    sqlActive(false);
});

sqlButton.addEventListener("click", (evt) => {
    sqlActive(true);
});

function sqlActive(isActive) {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);

    params.delete("active");

    if (isActive) {
        params.append("active", "sql");
    }
    url.search = params.toString();
    window.location.href = url.toString();
}

const sqlInput = document.getElementById("sqlInput");

function addQuery({innerText: query}) {
    sqlInput.value += "\n" + query + ";";
}

// function openExportPopup(form) {
//     const html = "<!-- Button trigger modal -->\n" +
//         "<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#exampleModalCenter\">\n" +
//         "  Launch demo modal\n" +
//         "</button>\n" +
//         "\n" +
//         "<!-- Modal -->\n" +
//         "<div class=\"modal fade\" id=\"exampleModalCenter\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalCenterTitle\" aria-hidden=\"true\">\n" +
//         "  <div class=\"modal-dialog modal-dialog-centered\" role=\"document\">\n" +
//         "    <div class=\"modal-content\">\n" +
//         "      <div class=\"modal-header\">\n" +
//         "        <h5 class=\"modal-title\" id=\"exampleModalLongTitle\">Modal title</h5>\n" +
//         "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
//         "          <span aria-hidden=\"true\">&times;</span>\n" +
//         "        </button>\n" +
//         "      </div>\n" +
//         "      <div class=\"modal-body\">\n" +
//         "        ...\n" +
//         "      </div>\n" +
//         "      <div class=\"modal-footer\">\n" +
//         "        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\n" +
//         "        <button type=\"button\" class=\"btn btn-primary\">Save changes</button>\n" +
//         "      </div>\n" +
//         "    </div>\n" +
//         "  </div>\n" +
//         "</div>"
// }
