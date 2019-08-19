const todo = require('./todo');

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
}

beforeEach(() => {
    req = {};
    res = {
        json: jest.fn(),
        status: jest.fn()
    };
})

describe('list', () => {
    it('works', () => {
        todo.list(req, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([{
                id: 1,
                name: 'Dinner',
                done: false
            },
            {
                id: 2,
                name: 'Sandwiches',
                done: false
            }
        ]);
    })
});
describe('create', () => {
    it('works', () => {
        req.body = {
            name: 'Lunch'
        };
        todo.create(req, res);
        expectStatus(200);
        expectResponse(
            'Create: Lunch'
        );
    });
    it('handles missing body', () => {
        todo.create(req, res);
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
        todo.create(req, res);
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
        todo.create(req, res);
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
        todo.create(req, res);
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
        todo.create(req, res);
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

});
describe('delete', () => {

});
describe('toggle', () => {

});