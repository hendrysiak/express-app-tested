const request = require('supertest');
const {
    app
} = require('./app');

it('works', async() => {
    const response = await request(app).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toEqual('Hello world!');
});

it('handles pages thar are not found', async() => {
    const response = await request(app).get('/whatever');

    expect(response.status).toEqual(404);
    expect(response.text).toEqual('not found');

    // expect(response.text).toMatchSnapshot();
})