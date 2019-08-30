const {
    connect,
    disconnect,
    drop
} = require("../client");

const {
    ObjectId
} = require('mongodb')

const {
    getTodos,
    createTodo
} = require('../db');

const todoApi = require("../todoApi");

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

beforeAll(connect);
afterAll(disconnect);
beforeEach(drop);

beforeEach(() => {
    req = {
        params: {}
    };
    res = {
        json: jest.fn(),
        send: jest.fn(),
        status: jest.fn()
    };
});

describe("list", () => {
    it("works", async () => {
        await todoApi.list(req, res);

        const todos = await getTodos();

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
    });
});
describe("create", () => {
    it("works", async () => {
        const name = "Supper";
        const {
            length
        } = await getTodos();
        // expect(todo.getTodos()).toHaveLength(2); // czy długoś tablicy jest odpowiednia
        req.body = {
            name
        };
        await todoApi.create(req, res);
        const todos = await getTodos();
        expectStatus(200);
        // expectResponse( ponieważ klient wie, co było nadane
        //     `Create: ${name}`
        // );

        expectResponse(todos[todos.length - 1]); // spodziewamy się w odpowiedzi do klienta ostatniego elementu, który ma być tym, co wysłano

        expect(todos).toHaveLength(length + 1);

        // expect(new Set(todos.map(todo => todo.id)).size).toEqual(todos.length); // tworzymy zbiór, który będzie przyjmować tylko elementy niepowtarzalne za pomocą konstr. set; następnie mapujemy do tego zbioru id i otrzymujemy jego rozmiar (ilość unikalnych id) - to porównujemy z długością todo

        expect(todos[todos.length - 1]).toMatchObject({
            name,
            done: false
        }); // czy wartość pozycji pasuje
    });
    it("handles missing body", async () => {
        await todoApi.create(req, res);
        expectStatus(400);
        expectResponse({
            error: "Name is missing"
        });
        // expect(next).toHaveBeenCalledTimes(1);
        // expect(next).toHaveBeenCalledWith(new Error('Name is missing'));
        // expect(res.json).not.toHaveBeenCalled(); //nigdy się nie wykona
    });
    it("handles missing name in the body", async () => {
        req.body = {};
        await todoApi.create(req, res);
        expectStatus(400);
        expectResponse({
            error: "Name is missing"
        });
        // expect(next).toHaveBeenCalledTimes(1);
        // expect(next).toHaveBeenCalledWith(new Error('Name is missing'));
        // expect(res.json).not.toHaveBeenCalled();
    });
    it("handles an ampty name", async () => {
        req.body = {
            name: ""
        };
        await todoApi.create(req, res);
        expectStatus(400);
        expectResponse({
            error: "Name should not be empty"
        });
        // expect(next).toHaveBeenCalledTimes(1);
        // expect(next).toHaveBeenCalledWith(new Error('Name should not be empty'));
        // expect(res.json).not.toHaveBeenCalled();
    });
    it("handles an empty name (after triming)", async () => {
        req.body = {
            name: "  "
        };
        await todoApi.create(req, res);
        expectStatus(400);
        expectResponse({
            error: "Name should not be empty"
        });
        // expect(next).toHaveBeenCalledTimes(1);
        // expect(next).toHaveBeenCalledWith(new Error('Name should not be empty'));
        // expect(res.json).not.toHaveBeenCalled();
    });
    it("handles wrong name type", async () => {
        req.body = {
            name: 42
        };
        await todoApi.create(req, res);
        expectStatus(400);
        expectResponse({
            error: "Name should be a string"
        });
        // expect(next).toHaveBeenCalledTimes(1);
        // expect(next).toHaveBeenCalledWith(new Error('Name should be a string'));
        // expect(res.json).not.toHaveBeenCalled();
    });
});
describe("change", () => {
    const id = 42;
    const name = "Supper";
    const nextName = "Lunch"; //nazwa po zmianie
    it("works", async () => {
        // todoApi.addTodo(await todoApi.createTodo(name, id));
        const {
            _id
        } = await createTodo(name);
        const {
            length
        } = await getTodos();
        req.params.id = _id;
        req.body = {
            name: nextName
        };
        await todoApi.change(req, res);
        const todos = await getTodos();

        // const todo = todos.find(todo => todo.id === id); // znajdziemy todo o takim samym identyfikatorze, jak podany i przypiszemy do zmiennej
        const todo = todos.find(todo => todo._id.equals(_id));

        expectStatus(200);
        expectResponse(todo);

        expect(todos).toHaveLength(length);

        expect(todo).toMatchObject({
            name: nextName
        });
    });
    it("handles ObjectId id", async () => {
        req.params.id = ObjectId("whatever1234");
        req.body = {
            name: nextName
        };
        await todoApi.change(req, res);

        expectStatus(404);
        expectTextResponse("Not found");
    });
    it("handles missing todo", async () => {
        req.params.id = "whatever";
        req.body = {
            name: nextName
        };
        await todoApi.change(req, res);

        expectStatus(404);
        expectTextResponse("Not found");
    });
    it("handles missing body", async () => {
        req.params.id = id;
        await todoApi.change(req, res);
        expectStatus(400);
        expectResponse({
            error: "Name is missing"
        });
    });
    it("handles missing name in the body", async () => {
        req.params.id = id;
        req.body = {};
        await todoApi.change(req, res);
        expectStatus(400);
        expectResponse({
            error: "Name is missing"
        });
    });
    it("handles an ampty name", async () => {
        req.params.id = id;
        req.body = {
            name: ""
        };
        await todoApi.change(req, res);
        expectStatus(400);
        expectResponse({
            error: "Name should not be empty"
        });
    });
    it("handles an empty name (after triming)", async () => {
        req.params.id = id;
        req.body = {
            name: "  "
        };
        await todoApi.change(req, res);
        expectStatus(400);
        expectResponse({
            error: "Name should not be empty"
        });
    });
    it("handles wrong name type", async () => {
        req.params.id = id;
        req.body = {
            name: 42
        };
        await todoApi.change(req, res);
        expectStatus(400);
        expectResponse({
            error: "Name should be a string"
        });
    });
});
describe("delete", () => {
    const id = 42;
    const name = "Supper";
    it("works", async () => {
        const todo = await createTodo(name);
        // await todoApi.addTodo(await todoApi.createTodo("Supper", id));
        const {
            length
        } = await getTodos();
        req.params.id = todo._id;
        // const todo = (await getTodos()).find(todo => todo.id === id); // znajdziemy todo o takim samym identyfikatorze, jak podany i przypiszemy do zmiennej


        await todoApi.delete(req, res);

        const todos = await getTodos();

        expectStatus(200);
        expectResponse(todo);

        expect(todos).toHaveLength(length - 1);
    });
    it("handles missing todo", async () => {
        req.params.id = "whatever";
        await todoApi.delete(req, res);

        expectStatus(404);
        expectTextResponse("Not found");
    });
});
describe("toggle", () => {
    const id = 42;
    const name = "Supper";
    it("works with toggling to true", async () => {
        // await todoApi.addTodo(await todoApi.createTodo("Supper", id));
        const {
            _id
        } = await createTodo(name, false);
        // const {
        //     _id
        // } = todo;
        const {
            length
        } = await getTodos();
        req.params.id = _id;
        req.body = {
            done: true
        };
        await todoApi.toggle(req, res);

        const todos = await getTodos();
        const todo = todos.find(todo => todo._id.equals(_id));
        // const todo = (await getTodos()).find(todo => todo.id === id); // znajdziemy todo o takim samym identyfikatorze, jak podany i przypiszemy do zmiennej


        expectStatus(200);
        expectResponse(todo);
        expect(todos).toHaveLength(length);
        expect(todo.done).toEqual(true);
    });
    it("works with toggling to false", async () => {
        // await todoApi.addTodo(await todoApi.createTodo("Supper", id, true));
        // await todoApi.addTodo(await todoApi.createTodo("Supper", id));
        // const {
        //     _id
        // } = todo;
        const {
            _id
        } = await createTodo(name, true);
        const {
            length
        } = await getTodos();
        req.params.id = _id;
        req.body = {
            done: false
        };

        await todoApi.toggle(req, res);

        const todos = await getTodos();
        const todo = todos.find(todo => todo._id.equals(_id));
        // const todo = (await getTodos()).find(todo => todo.id === id); // znajdziemy todo o takim samym identyfikatorze, jak podany i przypiszemy do zmiennej
        expectStatus(200);
        expectResponse(todo);
        expect(todos).toHaveLength(length);
        expect(todo.done).toEqual(false);
    });
    it("handles missing todo", async () => {
        req.params.id = "whatever";
        req.body = {
            done: true
        };
        await todoApi.toggle(req, res);

        expectStatus(404);
        expectTextResponse("Not found");
    });
    it("handles missing body", async () => {
        req.params.id = id;
        await todoApi.toggle(req, res);
        expectStatus(400);
        expectResponse({
            error: "Done is missing"
        });
    });
    it("handles missing done in the body", async () => {
        req.params.id = id;
        req.body = {};
        await todoApi.toggle(req, res);
        expectStatus(400);
        expectResponse({
            error: "Done is missing"
        });
    });
    it("handles wrong done type", async () => {
        req.params.id = id;
        req.body = {
            done: 42
        };
        await todoApi.toggle(req, res);
        expectStatus(400);
        expectResponse({
            error: "Done should be a boolean"
        });
    });
});