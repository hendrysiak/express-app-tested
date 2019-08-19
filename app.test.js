const request = require('supertest');
const {
    app
} = require('./app');

it('works', async () => {
    const response = await request(app).get('/');
    expect(response.status).toEqual(200);
    expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
    // expect(response.text).toEqual('List');
});

it('works with creating a todo', async () => {
    const response = await request(app).post('/');
    expect(response.status).toEqual(400);
    // expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
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