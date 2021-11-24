import request from 'supertest';
import { app } from '../../app';

it('return a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'asdasdas',
      password: 'password',
    })
    .expect(400);
});

it('return a 400 with missing email and password', async () => {
  return request(app).post('/api/users/signin').send({}).expect(400);
});

it('fail when a email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'asdasdasd' })
    .expect(400);
});

it('responds with a cookie whe given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
