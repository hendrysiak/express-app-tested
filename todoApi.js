const {
    responseWithError,
    responseNotFound
} = require('./helpers/helpers');

let id = 1;

function getId() {
    const currentId = id;
    id += 1;
    return currentId;
};

function createTodo(name, id = getId(), done = false) {
    return {
        id,
        name,
        done
    };
};


const todos = [createTodo("Dinner"), createTodo("Sandwiches")];

function addTodo(todo) {
    todos.push(todo)
};

function verifyName(req, res) {
    if (!req.body || !req.body.hasOwnProperty("name")) {
        return responseWithError(res, "Name is missing");
    }
    let {
        name
    } = req.body;
    if (typeof name !== "string") {
        return responseWithError(res, "Name should be a string");
    }
    name = name.trim();
    if (name === "") {
        return responseWithError(res, "Name should not be empty");
    }
    return {
        name
    }
};

function findTodo(id) {
    const numberId = Number(id);
    return todos.find(todo => todo.id === numberId)
};


exports.getTodos = () => todos;

exports.createTodo = createTodo;

exports.addTodo = addTodo;

exports.list = (req, res) => {
    res.json(todos);
    // res.send('List)
};

exports.create = (req, res) => {
    const cleanName = verifyName(req, res)
    if (!cleanName) {
        return;
    };
    const name = req.body.name.trim();
    const todo = createTodo(cleanName.name);

    addTodo(todo);
    res.json(todo);

    // if (!req.body || !req.body.hasOwnProperty('name')) {
    //     return next(new Error('Name is missing'));
    // };
    // const {
    //     name
    // } = req.body
    // if (typeof name !== 'string') {
    //     return next(new Error('Name should be a string'))
    // }
    // if (name.trim() === '') {
    //     return next(new Error('Name should not be empty'))
    // };
    // res.json(`Create: ${name}`)
};

exports.change = (req, res) => {
    const cleanName = verifyName(req, res)
    if (!cleanName) {
        return;
    };
    const todo = findTodo(req.params.id);
    if (typeof todo === 'undefined') {
        return responseNotFound(res)
    }
    todo.name = cleanName.name
    res.json(todo);
};
exports.delete = (req, res) => {
    const todo = findTodo(req.params.id);
    if (typeof todo === 'undefined') {
        return responseNotFound(res)
    }
    todos.splice(todos.indexOf(todo), 1);
    res.json(todo);
};
exports.toggle = (req, res) => {
    const todo = findTodo(req.params.id);
    if (typeof todo === 'undefined') {
        return responseNotFound(res)
    };
    todo.done = !todo.done;
    res.json(todo);
};