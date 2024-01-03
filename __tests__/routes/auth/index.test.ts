// __tests__/routes/index.test.ts
import request from 'supertest';
import { app } from '../../../src/app';

describe('Authentication Routes', () => {
    
    // Test for GET /auth
    it('should return status 200 for GET /auth', async () => {
      const response = await request(app).get('/auth');
      expect(response.status).toBe(200);
    });
  
    // Test for POST /auth/login
    it('should authenticate user and return status 200 for POST /auth/login', async () => {
      // Mock user credentials for testing
      const credentials = {
        email: 'perussilucas@hotmail.com',
        password: 'Josi@nep1979',
      };
  
      const response = await request(app)
        .post('/auth/login')
        .send(credentials);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });
  
    // Test for POST /auth/new
    it('should create a new user and return status 200 for POST /auth/new', async () => {
      // Mock user data for testing
      const userData = {
        email: 'perus@hotmssssail.com',
        password: 'newuserpassword',
        name: 'New',
        last_name: 'User',
        birthday: '1999-01-15T00:00:00.000Z',
        sex: 1,
      };
  
      const response = await request(app)
        .post('/auth/new')
        .send(userData);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('createdUser');
    });

    // Test for POST /auth/login
    it('should return status 401 for invalid credentials in POST /auth/login', async () => {
        const invalidCredentials = {
          email: 'perussilucas@hotmail.com',
          password: 'invalidpassword',
        };
    
        const response = await request(app)
          .post('/auth/login')
          .send(invalidCredentials);
    
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Senha incorreta.');
    });
    
    // Test for POST /auth/new with existing user
    it('should return status 400 for creating a user that already exists in POST /auth/new', async () => {
    // Use an existing user's data for testing
    const existingUser = {
        email: 'perussilucas@hotmail.com',
        password: 'testpassword',
        name: 'Existing',
        last_name: 'User',
        birthday: '1999-01-15T00:00:00.000Z',
        sex: 1,
    };

    const response = await request(app)
        .post('/auth/new')
        .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'This account already exists');
    });
    
    // Test for POST /auth/new with missing required fields
    it('should return status 400 for missing required fields in POST /auth/new', async () => {
    // Omitting 'email' field intentionally
    const userDataWithoutEmail = {
        password: 'newuserpassword',
        name: 'New',
        last_name: 'User',
        birthday: '1999-01-15T00:00:00.000Z',
        sex: 1,
    };

    const response = await request(app)
        .post('/auth/new')
        .send(userDataWithoutEmail);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid request data. Please provide all required parameters.');
    });
  
});