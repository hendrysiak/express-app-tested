const {
    getTodos,
    createTodo,
    findAndUpdateTodo,
    findAndDeleteTodo
} = require('./db');

const {
    responseWithError,
    responseNotFound
} = require('./helpers/helpers');

// let id = 1;

// function getId() {
//     const currentId = id;
//     id += 1;
//     return currentId;
// };

// function deprecatedCreateTodo(name, id = getId(), done = false) {
//     return {
//         id,
//         name,
//         done
//     };
// };


// const todos = [deprecatedCreateTodo("Dinner"), deprecatedCreateTodo("Sandwiches")];

// function deprecatedAddTodo(todo) {
//     todos.push(todo)
// };


// function findTodo(id) {
//     const numberId = Number(id);
//     return todos.find(todo => todo.id === numberId)
// };


// exports.getTodos = () => todos;

// exports.createTodo = deprecatedCreateTodo;
// exports.createTodo = createTodo;

// exports.addTodo = deprecatedAddTodo;
// exports.addTodo = addTodo;

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

function verifyDone(req, res) {
    if (!req.body || !req.body.hasOwnProperty("done")) {
        return responseWithError(res, "Done is missing");
    }
    let {
        done
    } = req.body;
    if (typeof done !== "boolean") {
        return responseWithError(res, "Done should be a boolean");
    }
    return {
        done
    }
};
exports.list = async (req, res) => {
    const todos = await getTodos();
    res.json(todos);
    // res.send('List)
};

exports.create = async (req, res) => {
    const cleanName = verifyName(req, res)
    if (!cleanName) {
        return;
    };
    // const name = req.body.name.trim();
    const todo = await createTodo(cleanName.name);

    // addTodo(todo)
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

exports.change = async (req, res) => {
    const cleanName = verifyName(req, res)
    if (!cleanName) {
        return;
    };
    // const todo = findTodo(req.params.id);
    const todo = await findAndUpdateTodo(req.params.id, {
        $set: {
            name: cleanName.name
        }
    });
    // if (typeof todo === 'undefined') {
    if (todo === null) {
        return responseNotFound(res)
    }
    // todo.name = cleanName.name
    res.json(todo);
};
exports.delete = async (req, res) => {
    const todo = await findAndDeleteTodo(req.params.id);
    if (todo === null) {
        return responseNotFound(res)
    }
    // todos.splice(todos.indexOf(todo), 1);
    res.json(todo);
};
exports.toggle = async (req, res) => {
    const cleanDone = verifyDone(req, res);
    if (!cleanDone) {
        return;
    };
    const todo = await findAndUpdateTodo(req.params.id, {
        $set: {
            done: cleanDone.done
        }
    });
    // const todo = findTodo(req.params.id);
    // if (typeof todo === 'undefined') {
    if (todo === null) {
        return responseNotFound(res)
    };
    // todo.done = !todo.done;
    res.json(todo);
};