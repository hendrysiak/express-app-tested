const express = require('express');
const bodyParser = require('body-parser')

const todo = require('./todo')

const app = express();

app.set('x-powered-by', false);
app.use(bodyParser.json());



app.get('/', todo.list);

// wyrzucanie na siłę błędu do testów

// app.get('/error', (req, res) => {
//     throw new Error('Error!')
// });

app.post('/', todo.create);
app.put('/:id', todo.change);

app.delete('/:id', todo.delete);

app.post('/:id/toggle', todo.toggle);

app.get('*', (req, res) => {
    res.status(404);
    res.send('Not found')
})

app.use((err, req, res, next) => {
    console.log(error.stack)
    res.status(500);
    res.send(`We have encountered an Error and we were notified it. 
    We'll try to fix it as soon as possible!`);
});

exports.app = app;