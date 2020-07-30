const app = require('./app');

const PORT = 5932;

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});