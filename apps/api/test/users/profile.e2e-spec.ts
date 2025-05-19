import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

// You may need to adjust this depending on your auth setup
describe('/users/profile (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Register a user and login to get a JWT token
    const email = `testuser${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email, password, name: 'Test User' })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(201);
    jwtToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /users/profile should return the current user profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('_id');
  });

  it('PATCH /users/profile should update the current user profile', async () => {
    const newName = 'Updated Name';
    const res = await request(app.getHttpServer())
      .patch('/api/v1/users/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: newName })
      .expect(200);
    expect(res.body).toHaveProperty('name', newName);
  });
});
