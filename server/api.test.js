const axios = require('axios');

const API_URL = 'http://localhost:5000';

describe('API Tests', () => {
    let authToken;

    test('Login API - Successful login', async () => {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            username: 'admin',
            password: 'password'
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('token');
        expect(response.data).toHaveProperty('username', 'admin');

        authToken = response.data.token;
    });

    test('Login API - Invalid credentials', async () => {
        try {
            await axios.post(`${API_URL}/api/auth/login`, {
                username: 'wrong',
                password: 'wrong'
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toHaveProperty('message', 'Invalid credentials');
        }
    });

    test('Tasks API - Get tasks', async () => {
        const response = await axios.get(`${API_URL}/api/tasks`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });

    test('Tasks API - Add task', async () => {
        const taskDescription = 'Test task ' + Date.now();
        const response = await axios.post(`${API_URL}/api/tasks`, 
            { description: taskDescription },
            { headers: { Authorization: `Bearer ${authToken}` }}
        );

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('description', taskDescription);
        expect(response.data).toHaveProperty('completed', false);
    });
});