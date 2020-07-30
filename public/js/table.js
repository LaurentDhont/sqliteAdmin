const locationValue = document.getElementById("location").value;
const table = document.getElementById("table").innerText;
const errorDiv = document.getElementById("errorDiv");
const contextMenu = document.getElementById("contextMenu");
const realTable = document.getElementById("realTable");

const structureQuery = document.getElementById("structureQuery");

const edit = document.getElementById("edit");
const setNull = document.getElementById("setNull");

function editCell(cell) {
    const isOpen = cell.getAttribute("isOpen") === "true";

    if (!isOpen) {
        // console.log(cell.style.lineHeight);
        // console.log(cell.offsetHeight);
        const spanElements = cell.getElementsByTagName("span");
        if (spanElements.length > 0) {
            spanElements[0].remove();
        }
        const value = cell.innerText;
        const inputElement = document.createElement("textarea");
        inputElement.value = value;
        // inputElement.style.width = "100%";
        inputElement.className = "form-control";


        inputElement.addEventListener("blur", stopEditingCell);

        cell.innerText = null;
        cell.appendChild(inputElement);
        inputElement.style.height = inputElement.scrollHeight + 1 +"px";
        inputElement.focus();
        cell.setAttribute("isOpen", "true");
    }

}

async function stopEditingCell(evt) {
    const originalValue = evt.target.parentElement.getAttribute("value");
    const value = evt.target.value;
    const wasNull = evt.target.parentElement.getAttribute("wasNull");
    const ROWID = evt.target.parentElement.parentElement.getAttribute("ROWID");
    const column = evt.target.parentElement.getAttribute("column");

    evt.target.parentElement.setAttribute("isOpen", "false");

    if (originalValue !== value) {
        await updateRow(column, ROWID, value, evt.target.parentElement, wasNull);
    }
    else if (wasNull){
        await updateRow(column, ROWID, value, evt.target.parentElement, wasNull);
    }
    else {
        evt.target.parentElement.innerText = evt.target.value;
    }
}

async function updateRow(column, ROWID, value, cell, wasNull) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const request = new Request(window.location.origin + "/databases/updateRow" , {
        method: "PUT",
        body: JSON.stringify({
            location: locationValue,
            table: table,
            column: column,
            value: value,
            ROWID: ROWID
        }),
        headers: headers
    });

    try {
        const response = await fetch(request);
        const status = response.status;

        const isGrey = window.getComputedStyle(cell.parentElement, null).getPropertyValue("background-color") === "rgba(0, 0, 0, 0.05)";

        if (status === 200) {
            cell.style.animationDuration = "2s";
            if (isGrey) {
                cell.style.animationName = "successGrey";
            }
            else {
                cell.style.animationName = "success";
            }

            if (value === null) {
                cell.innerText = null;
                const span = document.createElement("span");
                span.className = "nullValues";
                span.innerText = "<null>";
                cell.appendChild(span);
                cell.setAttribute("wasNull", "true");
            }
            else {
                cell.innerText = value;
                cell.setAttribute("wasNull", null);
            }

            setTimeout(() => {
                cell.style.animationName = null;
                cell.style.animationDuration = null;
            }, 2000);

        }
        else {
            const text = await response.text();
            console.log(text);
            cell.style.animationDuration = "2s";
            if (isGrey) {
                cell.style.animationName = "errorGrey";
            }
            else {
                cell.style.animationName = "error";
            }


            addError(text);

            if (wasNull) {
                cell.innerText = null;
                const span = document.createElement("span");
                span.className = "nullValues";
                span.innerText = "<null>";
                cell.appendChild(span);
            }
            else {
                cell.innerText = cell.getAttribute("value");
            }


            setTimeout(() => {
                cell.style.animationName = null;
                cell.style.animationDuration = null;
            }, 2000);
        }
    }
    catch (e) {
        console.log(e);
        addError(e.message);
        // addError("Er is iets mis gegaan met het aanpassen van het examen (een netwerkprobleem).");
    }
}

function addError(message) {
    errorDiv.innerHTML += "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n" +
         message +
        "            <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n" +
        "                <span aria-hidden=\"true\">&times;</span>\n" +
        "            </button>\n" +
        "        </div>"
}

const filters = document.getElementsByClassName("filters");

for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("keypress", (evt) => {
        console.log(evt.key);
        if (evt.key === "Enter") {
            console.log(filters[i].parentElement);
            filters[i].parentElement.submit();
        }
    });
}

const cells = document.getElementsByClassName("cells");

let selectedCell;

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("contextmenu", (evt) => {

        evt.preventDefault();
        if (selectedCell) {
            selectedCell.style.background = null;
        }
        contextMenu.style.left = evt.clientX  + document.body.scrollLeft + "px";
        contextMenu.style.top = evt.clientY  + document.body.scrollTop +  "px";
        contextMenu.classList.remove("d-none");

        if (evt.target.tagName !== "TD") {
            evt.target.parentElement.style.background = "lightblue";
            selectedCell = evt.target.parentElement;
        }
        else {
            evt.target.style.background = "lightblue";
            selectedCell = evt.target;
        }

        realTable.style.overflow = "hidden";
    });
}

document.addEventListener("click", (evt) => {
    console.log(evt);
    if (evt.target !== contextMenu && !Array.from(contextMenu.children).includes(evt.target) ) {
        if (selectedCell) {
            selectedCell.style.background = null;
        }
        contextMenu.classList.add("d-none");
        realTable.style.overflow = "scroll";
    }
});

edit.addEventListener("click", (evt) => {
    if (selectedCell) {
        editCell(selectedCell);
        contextMenu.classList.add("d-none");
        realTable.style.overflow = "scroll";
        selectedCell.style.background = null;
    }
});

setNull.addEventListener("click", async (evt) => {
    if (selectedCell) {
        contextMenu.classList.add("d-none");
        realTable.style.overflow = "scroll";
        selectedCell.style.background = null;

        const originalValue = selectedCell.getAttribute("value");
        const value = null;

        const ROWID = selectedCell.parentElement.getAttribute("ROWID");
        const column = selectedCell.getAttribute("column");

        if (originalValue !== value) {
            await updateRow(column, ROWID, value, selectedCell, );
        }
    }
});

structureQuery.rows = structureQuery.value.split('\n').length;
