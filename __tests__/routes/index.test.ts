// __tests__/routes/index.test.ts
import request from 'supertest';
import { app } from '../../src/app';

describe('Routes in /', () => {
  it('should return status 200 for GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});