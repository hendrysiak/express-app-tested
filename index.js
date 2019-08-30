const {
    app
} = require('./app');

const {
    connect
} = require('./client');

const port = process.env.PORT || 3000; // dobierz port domyślny, lub wpisz 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

connect();