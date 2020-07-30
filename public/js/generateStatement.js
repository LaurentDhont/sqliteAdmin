async function generateStatement(type, placeHolder, tableName, where) {
    try {
        type = type.options[type.selectedIndex].value;
        const location = new URLSearchParams(new URL(window.location.href).search).get('location');
        console.log(location);
        console.log(window.location.origin);
        const queryParams = new URLSearchParams({
            location: location,
            table: tableName,
            type: type,
            where: where.checked
        });

        const response = await fetch(window.location.origin + "/databases/generateStatement?" + queryParams.toString(), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        placeHolder.value = (await response.text()).trim();
        placeHolder.style.height = null;
        placeHolder.style.height = placeHolder.scrollHeight + 1 + "px";
    }
    catch (e) {
        console.error(e);
    }
}
