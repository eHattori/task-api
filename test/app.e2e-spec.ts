import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App Flow (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('User manager', () => {
    let jwtToken = '';
    let tasks = [];
    const user = { username: 'hattori', password: 'changeme' };

    it('should request /auth/login -> POST to generate a jwt token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(201);

      jwtToken = response.body.access_token;
      expect(jwtToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
    });

    it('should fail request /auth/login -> POST to generate a jwt token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'hattori', password: 'wrong' })
        .expect(401);
    });

    it('should request /tasks -> POST to create a task', async () => {
      const task = { summary: 'new task' };
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(task)
        .expect(201);

      const newTask = response.body;
      expect(newTask.summary).toBe(task.summary);
    });

    it('should request /tasks?username=hattori -> GET all tasks', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tasks?username=${user.username}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      tasks = response.body;
      expect(tasks.length).toBeGreaterThanOrEqual(1);
    });

    it('should request /tasks/:id -> GET task by Id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tasks/${tasks[0].id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const task = response.body;
      expect(task.id).toBe(tasks[0].id);
    });

    it('should request /tasks/:id -> PUT to update task', async () => {
      const task = { summary: 'updated' };
      const response = await request(app.getHttpServer())
        .put(`/tasks/${tasks[0].id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(task)
        .expect(200);

      const updatedTask = response.body;
      expect(updatedTask.summary).toBe(task.summary);
    });

    it('should request /tasks/:id -> GET task by Id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/tasks/${tasks[0].id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

    describe('Tech flow', () => {
      const userTech = { username: 'other_user', password: 'changeme' };
      beforeAll(async () => {
        const task = { summary: 'new task' };
        await request(app.getHttpServer())
          .post('/tasks')
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(task);
      });

      it('should request /auth/login -> POST to generate a jwt token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userTech)
          .expect(201);

        jwtToken = response.body.access_token;
        expect(jwtToken).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        );
      });

      it('should request /tasks -> POST to create a task', async () => {
        const task = { summary: 'new task' };
        const response = await request(app.getHttpServer())
          .post('/tasks')
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(task)
          .expect(201);

        const newTask = response.body;
        expect(newTask.summary).toBe(task.summary);
      });

      it('should fail request /tasks?username=hattori -> GET all tasks', async () => {
        const response = await request(app.getHttpServer())
          .get(`/tasks?username=${user.username}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(401);
      });

      it('should request /tasks?username=other_user -> GET all tasks', async () => {
        const response = await request(app.getHttpServer())
          .get(`/tasks?username=${userTech.username}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);

        tasks = response.body;
        expect(tasks.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
