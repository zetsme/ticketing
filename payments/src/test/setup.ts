import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  function signin(id?: string): string[];
}
// declare global {
//   namespace NodeJS {
//     interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }

jest.mock('../nats-wrapper');

let mongo: any;

process.env.STRIPE_KEY =
  'sk_test_51JwM0PJms7fa5vjxZumt5STMLfMkjKd4kShkQGMqkLOyUQBSbIC9NRxXaabf2QtXQ1BNZ32XYofynqi0kbNAsLSs00CQ0yR1R9';

beforeAll(async () => {
  process.env.JWT_KEY = 'mysecret';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  // jest.setTimeout(20000);
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
}, 200000);

global.signin = (id?: string) => {
  // Build a JWT payload {id,email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@mail.com',
  };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object {jwt: MY_JWT}
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode that in base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with encoded data
  return [`express:sess=${base64}`];
};
