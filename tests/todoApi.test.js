const todoApi = require('../todoApi');

let req;
let res;

function expectStatus(status) {
    if (status === 200) {
        return;
    }
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(status);
}

function expectResponse(json) {
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(json);
    expect(res.send).not.toHaveBeenCalled();
}

function expectTextResponse(text) {
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(text);
    expect(res.json).not.toHaveBeenCalled();
}

beforeEach(() => {
    req = {
        params: {},
    };
    res = {
        json: jest.fn(),
        send: jest.fn(),
        status: jest.fn()
    };
})

describe('list', () => {
    it('works', () => {
        todoApi.list(req, res);

        const todos = todoApi.getTodos();

        expectStatus(200);
        expectResponse(todos);

        // zamiast
        // expect(res.json).toHaveBeenCalledTimes(1);
        // expect(res.json).toHaveBeenCalledWith([{
        //         id: 1,
        //         name: 'Dinner',
        //         done: false
        //     },
        //     {
        //         id: 2,
        //         name: 'Sandwiches',
        //         done: false
        //     }
        // ]);
    })
});
describe('create', () => {
    it('works', () => {
        const name = 'Supper'
        const {
            length
        } = todoApi.getTodos();
        // expect(todo.getTodos()).toHaveLength(2); // czy długoś tablicy jest odpowiednia
        req.body = {
            name
        };
        todoApi.create(req, res);
        const todos = todoApi.getTodos();
        expectStatus(200);
        // expectResponse( ponieważ klient wie, co było nadane
        //     `Create: ${name}`
        // );

        expectResponse(todos[todos.length - 1]); // spodziewamy się w odpowiedzi do klienta ostatniego elementu, który ma być tym, co wysłano



        expect(todos).toHaveLength(length + 1);
        expect(new Set(todos.map(todo => todo.id)).size).toEqual(todos.length); // tworzymy zbiór, który będzie przyjmować tylko elementy niepowtarzalne za pomocą konstr. set; następnie mapujemy do tego zbioru id i otrzymujemy jego rozmiar (ilość unikalnych id) - to porównujemy z długością todo
        expect(todos[todos.length - 1]).toMatchObject({
            name,
            done: false
        }); // czy wartość pozycji pasuje
    });
    it('handles missing body', () => {
        todoApi.create(req, res);
        expectStatus(400);
        expectResponse({
            error: 'Name is missing'
        });
        // expect(next).toHaveBeenCalledTimes(1);
        // expect(next).toHaveBeenCalledWith(new Error('Name is missing'));
        // expect(res.json).not.toHaveBeenCalled(); //nigdy się nie wykona

    });
    it('handles missing name in the body', () => {
        req.body = {};
        todoApi.create(req, res);
        expectStatus(400);
        expectResponse({
            error: 'Name is missing'
        });
        // expect(next).toHaveBeenCalledTimes(1);
        // expect(next).toHaveBeenCalledWith(new Error('Name is missing'));
        // expect(res.json).not.toHaveBeenCalled();

    });
    it('handles an ampty name', () => {
        req.body = {
            name: ''
        };
        todoApi.create(req, res);
        expectStatus(400);
        expectResponse({
            error: 'Name should not be empty'
        });
        // expect(next).toHaveBeenCalledTimes(1);
        // expect(next).toHaveBeenCalledWith(new Error('Name should not be empty'));
        // expect(res.json).not.toHaveBeenCalled();

    });
    it('handles an empty name (after triming)', () => {
        req.body = {
            name: '  '
        };
        todoApi.create(req, res);
        expectStatus(400);
        expectResponse({
            error: 'Name should not be empty'
        });
        // expect(next).toHaveBeenCalledTimes(1);
        // expect(next).toHaveBeenCalledWith(new Error('Name should not be empty'));
        // expect(res.json).not.toHaveBeenCalled();

    });
    it('handles wrong name type', () => {
        req.body = {
            name: 42
        };
        todoApi.create(req, res);
        expectStatus(400);
        expectResponse({
            error: 'Name should be a string'
        });
        // expect(next).toHaveBeenCalledTimes(1);
        // expect(next).toHaveBeenCalledWith(new Error('Name should be a string'));
        // expect(res.json).not.toHaveBeenCalled();

    });
});
describe('change', () => {
    const id = 42;
    const name = 'Supper';
    const nextName = 'Lunch'; //nazwa po zmianie
    it('works', () => {
        todoApi.addTodo(todoApi.createTodo(name, id));
        const {
            length
        } = todoApi.getTodos();
        req.params.id = id;
        req.body = {
            name: nextName
        };
        todoApi.change(req, res);
        const todos = todoApi.getTodos();


        const todo = todos.find(todo => todo.id === id); // znajdziemy todo o takim samym identyfikatorze, jak podany i przypiszemy do zmiennej

        expectStatus(200);
        expectResponse(todo);

        expect(todos).toHaveLength(length);

        expect(todo).toMatchObject({
            name: nextName
        });
    });
    it('handles missing todo', () => {
        req.params.id = 'whatever';
        req.body = {
            name: nextName
        };
        todoApi.change(req, res);

        expectStatus(404);
        expectTextResponse('Not found');

    });
    it('handles missing body', () => {
        req.params.id = id;
        todoApi.change(req, res);
        expectStatus(400);
        expectResponse({
            error: 'Name is missing'
        });

    });
    it('handles missing name in the body', () => {
        req.params.id = id;
        req.body = {};
        todoApi.change(req, res);
        expectStatus(400);
        expectResponse({
            error: 'Name is missing'
        });

    });
    it('handles an ampty name', () => {
        req.params.id = id;
        req.body = {
            name: ''
        };
        todoApi.change(req, res);
        expectStatus(400);
        expectResponse({
            error: 'Name should not be empty'
        });

    });
    it('handles an empty name (after triming)', () => {
        req.params.id = id;
        req.body = {
            name: '  '
        };
        todoApi.change(req, res);
        expectStatus(400);
        expectResponse({
            error: 'Name should not be empty'
        });

    });
    it('handles wrong name type', () => {
        req.params.id = id;
        req.body = {
            name: 42
        };
        todoApi.change(req, res);
        expectStatus(400);
        expectResponse({
            error: 'Name should be a string'
        });

    });
});
describe('delete', () => {
    const id = 42;

    it('works', () => {
        todoApi.addTodo(todoApi.createTodo('Supper', id));
        const {
            length
        } = todoApi.getTodos();
        const todo = todoApi.getTodos().find(todo => todo.id === id); // znajdziemy todo o takim samym identyfikatorze, jak podany i przypiszemy do zmiennej
        req.params.id = id;

        todoApi.delete(req, res);

        const todos = todoApi.getTodos();

        expectStatus(200);
        expectResponse(todo);

        expect(todos).toHaveLength(length - 1);
    });
    it('handles missing todo', () => {
        req.params.id = 'whatever';
        todoApi.delete(req, res);

        expectStatus(404);
        expectTextResponse('Not found');

    });
});
describe('toggle', () => {
    const id = 42;

    it('works', () => {
        todoApi.addTodo(todoApi.createTodo('Supper', id));
        const {
            length
        } = todoApi.getTodos();
        const todo = todoApi.getTodos().find(todo => todo.id === id); // znajdziemy todo o takim samym identyfikatorze, jak podany i przypiszemy do zmiennej
        req.params.id = id;

        todoApi.toggle(req, res);

        const todos = todoApi.getTodos();

        expectStatus(200);
        expectResponse(todo);
        expect(todos).toHaveLength(length);
        expect(todo.done).toEqual(true);
    });
    it('works with toggling back', () => {
        todoApi.addTodo(todoApi.createTodo('Supper', id, true));
        const {
            length
        } = todoApi.getTodos();
        req.params.id = id;

        todoApi.toggle(req, res);


        const todos = todoApi.getTodos();
        const todo = todoApi.getTodos().find(todo => todo.id === id); // znajdziemy todo o takim samym identyfikatorze, jak podany i przypiszemy do zmiennej
        expectStatus(200);
        expectResponse(todo);
        expect(todos).toHaveLength(length);
        expect(todo.done).toEqual(false);
    });
    it('handles missing todo', () => {
        req.params.id = 'whatever';
        todoApi.toggle(req, res);

        expectStatus(404);
        expectTextResponse('Not found');

    });
});