const filters = document.getElementsByClassName("filters");
const structureQuery = document.getElementById("structureQuery");

for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("keypress", (evt) => {
        console.log(evt.key);
        if (evt.key === "Enter") {
            console.log(filters[i].parentElement);
            filters[i].parentElement.submit();
        }
    });
}

structureQuery.rows = structureQuery.value.split('\n').length + 1;
