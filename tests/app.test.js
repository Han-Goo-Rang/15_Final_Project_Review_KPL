// tests/app.test.js
const request = require('supertest');
const path = require('path');
const auth = require('../middleware/auth');
const express = require('express');
const appRouter = require('../app');

// Mock middleware auth.authenticate
jest.mock('../middleware/auth', () => ({
  authenticate: (req, res, next) => {
    if (req.headers.authorization) {
      next();
    } else {
      res.status(401).json({ message: 'No token provided' });
    }
  }
}));

describe('App Router', () => {
  let server;
  const app = express();

  // Digunakan untuk membuat server sebelum setiap blok deskripsi
  beforeAll(() => {
    app.use(express.json());
    app.use(appRouter);
    server = app.listen(3001); // Gunakan port yang sesuai
  });

  // Tutup server setelah semua tes selesai
  afterAll(() => {
    server.close();
  });

  describe('GET /', () => {
    test('should return dashboard.html if authenticated', async () => {
      await request(app)
        .get('/')
        .set('Authorization', 'Bearer valid-token')
        .expect(200)
        .expect('Content-Type', /html/);
    });

    test('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/')
        .expect(401)
        .expect({ message: 'No token provided' });
    });
  });

  // Ulangi struktur yang sama untuk GET /users, GET /books, dan GET /branches
  describe('GET /users', () => {
    test('should return user-management.html if authenticated', async () => {
      await request(app)
        .get('/users')
        .set('Authorization', 'Bearer valid-token')
        .expect(200)
        .expect('Content-Type', /html/);
    });

    test('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/users')
        .expect(401)
        .expect({ message: 'No token provided' });
    });
  });

  describe('GET /books', () => {
    test('should return book-management.html if authenticated', async () => {
      await request(app)
        .get('/books')
        .set('Authorization', 'Bearer valid-token')
        .expect(200)
        .expect('Content-Type', /html/);
    });

    test('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/books')
        .expect(401)
        .expect({ message: 'No token provided' });
    });
  });

  describe('GET /branches', () => {
    test('should return branch-management.html if authenticated', async () => {
      await request(app)
        .get('/branches')
        .set('Authorization', 'Bearer valid-token')
        .expect(200)
        .expect('Content-Type', /html/);
    });

    test('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/branches')
        .expect(401)
        .expect({ message: 'No token provided' });
    });
  });
});