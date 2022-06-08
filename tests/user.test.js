const request = require('supertest')
const app = require('../routes/api/user')

 
describe('Integration tests', () => {
  test('GET /api/user', async () => {
    const expected = { status: 200, body: { success: true } }
    const res = await request(app).get('/api/user');
    expect(res.status).toEqual(expected.status);
    expect(res.body).toEqual(expected.body);
  });
},7000);

