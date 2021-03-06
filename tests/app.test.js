const request = require('supertest');
const {
    app
} = require('../app');

it('works', async () => {
    const response = await request(app).get('/');
    expect(response.status).toEqual(200);
    expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
    // expect(response.text).toEqual('List');
});

it('returns an error when creating a todo without a body', async () => {
    const response = await request(app).post('/');
    expect(response.status).toEqual(400);
    // expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
});

// it('creates a todo', async () => {
//     const response = await request(app).post('/').send({
//         name: "Supper"
//     });

//     expect(response.status).toEqual(200);
//     expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
//     expect(response.text).toEqual("{\"id\":3,\"name\":\"Supper\",\"done\":false}");

// });
it('updates a todo', async () => {
    const name = 'Supper'

    const createResponse = await request(app).post('/').send({
        name
    });

    expect(createResponse.status).toEqual(200);
    expect(createResponse.header['content-type']).toEqual('application/json; charset=utf-8');
    const createdTodo = JSON.parse(createResponse.text)
    expect(createdTodo).toMatchObject({
        name,
        done: false
    });

    const id = createdTodo.id
    const nextName = 'Lunch'
    const response = await request(app).put(`/${id}`).send({
        name: nextName
    });

    expect(response.status).toEqual(200);
    expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
    const todo = JSON.parse(response.text)
    expect(todo).toMatchObject({
        name: nextName,
        done: false
    });
});

it('handles pages thar are not found', async () => {
    const response = await request(app).get('/whatever');

    expect(response.status).toEqual(404);
    expect(response.text).toEqual('Not found');

    // expect(response.text).toMatchSnapshot();
});

//obsługa błędu

// it('handles pages with errors', async () => {
//     const response = await request(app).get('/error');

//     expect(response.status).toEqual(500);
//     expect(response.text).toMatchSnapshot();

//     // expect(response.text).toMatchSnapshot();
// })