const express = require('express');
const bodyParser = require('body-parser')

const {
    responseNotFound
} = require('./helpers/helpers');

const todoApi = require('./todoApi')

const app = express();

app.set('x-powered-by', false);
app.use(bodyParser.json());

// method http + params

app.get('/', todoApi.list);

// wyrzucanie na siłę błędu do testów

// app.get('/error', (req, res) => {
//     throw new Error('Error!')
// });

app.post('/', todoApi.create);
app.put('/:id', todoApi.change);

app.delete('/:id', todoApi.delete);

app.post('/:id/toggle', todoApi.toggle);

app.get('*', (req, res) => {
    responseNotFound(res);
});

app.use((err, req, res, next) => {
    console.log(error.stack)
    res.status(500);
    res.send(`We have encountered an Error and we were notified it. 
    We'll try to fix it as soon as possible!`);
});

exports.app = app;