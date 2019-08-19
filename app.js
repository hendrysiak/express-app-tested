const express = require('express');

const app = express();

app.set('x-powered-by', false)

app.get('/', (req, res) => {
    res.send('Hello world!')
});

app.get('*', (req, res) => {
    res.status(404);
    res.send('not found')
})

exports.app = app;