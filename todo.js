let id = 1;

function getId() {
    const currentId = id;
    id += 1;
    return currentId;
}

function createTodo(name) {
    const id = getId();
    return {
        id,
        name,
        done: false
    }
}

function responseWithError(res, error) {
    res.status(400);
    res.json({
        error
    })
}

const todos = [createTodo(
        'Dinner'
    ),
    createTodo(
        'Sandwiches')
];

exports.list = (req, res) => {
    res.json(todos)
    // res.send('List)
};

exports.create = (req, res) => {
    if (!req.body || !req.body.hasOwnProperty('name')) {
        return responseWithError(res, 'Name is missing');
    };
    let {
        name
    } = req.body
    if (typeof name !== 'string') {
        return responseWithError(res, 'Name should be a string');
    }
    name = name.trim();
    if (name === '') {
        return responseWithError(res, 'Name should not be empty');
    };
    todos.push(createTodo(name));
    res.json(`Create: ${name}`)


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
    res.json(`Change: ${req.params.id}`)
};
exports.delete = (req, res) => {
    res.json(`Delete: ${req.params.id}`)
};
exports.toggle = (req, res) => {
    res.json(`Toggle: ${req.params.id}`)
};