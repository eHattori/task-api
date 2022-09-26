TaskApi NestJS Typescript Example

## Description

*Features:*

- API endpoint to save a new task;
- API endpoint to list tasks;
- Notify manager of each task performed by the tech
- This notification should not block any http request.

*Technologies:*
- [Nest](https://github.com/nestjs/nest).
- [NodeJs](https://nodejs.org/en/blog/release/v16.4.0/)
- [MySQL](https://dev.mysql.com/downloads/mysql/5.7.html)
- [Redis](https://redis.io/)

*System Design*

![image](https://user-images.githubusercontent.com/2198233/192349650-11a511c8-cddf-42a4-ba7d-478f9c8676df.png)

- Send request Login to generate token
- Send a POST to create a task, 
  - if the user is a `Technical` user, the api send a message to Redis Pub/Sub broker
  - The Consumer is subscriber in the Redis receive message and print the message
- All data is keeped in the MySQL database

## Installation

```bash
$ npm install
```

## Running the app

Run app in development mode using default port `3000` 

```bash
# Run API
$ npm start

# Run Consumer
$cd ./task-consumer && npm install && npm start
```

## Test

This project uses `Jest` to run test suites.

**Unit Tests**

```bash

$ npm run test

 PASS  src/app.controller.spec.ts
 PASS  src/auth/auth.service.spec.ts
 PASS  src/user/user.service.spec.ts
 PASS  src/task/task.controller.spec.ts
 PASS  src/task/task.service.spec.ts
 PASS  src/auth/auth.controller.spec.ts

Test Suites: 6 passed, 6 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        3.423 s, estimated 4 s
Ran all test suites.

```
**E2E Tests**

To run the `e2e` tests all the enviroment need to be running see `Docker` section

```bash
# e2e tests
$ npm run test:e2e
 PASS  test/app.e2e-spec.ts
  App Flow (e2e)
    User manager
      ✓ should request /auth/login -> POST to generate a jwt token (247 ms)
      ✓ should fail request /auth/login -> POST to generate a jwt token (36 ms)
      ✓ should request /tasks -> POST to create a task (30 ms)
      ✓ should request /tasks?username=hattori -> GET all tasks (20 ms)
      ✓ should request /tasks/:id -> GET task by Id (18 ms)
      ✓ should request /tasks/:id -> PUT to update task (22 ms)
      ✓ should request /tasks/:id -> GET task by Id (18 ms)
      Tech flow
        ✓ should request /auth/login -> POST to generate a jwt token (32 ms)
        ✓ should request /tasks -> POST to create a task (23 ms)
        ✓ should fail request /tasks?username=hattori -> GET all tasks (21 ms)
        ✓ should request /tasks?username=other_user -> GET all tasks (20 ms)

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        2.383 s, estimated 3 s
```

## Coverage Report

```bash
# test coverage
$ npm run test:cov
 PASS  src/app.controller.spec.ts
 PASS  src/auth/auth.service.spec.ts
 PASS  src/task/task.service.spec.ts
 PASS  src/task/task.controller.spec.ts
 PASS  src/user/user.service.spec.ts
 PASS  src/auth/auth.controller.spec.ts
---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------|---------|----------|---------|---------|-------------------
All files            |     100 |    93.33 |     100 |     100 |                   
 src                 |     100 |      100 |     100 |     100 |                   
  app.controller.ts  |     100 |      100 |     100 |     100 |                   
  app.service.ts     |     100 |      100 |     100 |     100 |                   
 src/auth            |     100 |       80 |     100 |     100 |                   
  auth.controller.ts |     100 |      100 |     100 |     100 |                   
  auth.service.ts    |     100 |       80 |     100 |     100 | 20                
 src/task            |     100 |      100 |     100 |     100 |                   
  task.controller.ts |     100 |      100 |     100 |     100 |                   
  task.service.ts    |     100 |      100 |     100 |     100 |                   
 src/user            |     100 |      100 |     100 |     100 |                   
  user.service.ts    |     100 |      100 |     100 |     100 |                   
---------------------|---------|----------|---------|---------|-------------------

Test Suites: 6 passed, 6 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        4.174 s

```

## Import Postman Collection

Follow the [Offial Documentation](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/) to import collection file `task-api.postman_collection.json` to you postman

## Routes 

**POST** - Login - `/auth/login`

```
{
    "username": "other_user",
    "password": "changeme"
}
```

Status Code: `201`

```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**POST** - Create Task - `/tasks`
 
```
{
    "summary": "new task"
}
```

Status Code: `201`

```
{
    "id": 1,
    "summary": "new task",    
    "date": "2022-09-26T12:06:28.000Z",
    "updatedAt": "2022-09-26T12:06:28.000Z",
    "user": {
        "id": 2,
        "username": "hattori"
    }
}
```

**GET** - Get All  - `/tasks`
 
Status Code: `200`

```
[
  {
    "id": 1,
    "summary": "new task",    
    "date": "2022-09-26T12:06:28.000Z",
    "updatedAt": "2022-09-26T12:06:28.000Z",
    "user": {
        "id": 2,
        "username": "hattori"
    }
  }
]
```

**GET** - Get All by user  - `/tasks?username=hattori`
 
Status Code: `200`

```
[
  {
    "id": 1,
    "summary": "new task",    
    "date": "2022-09-26T12:06:28.000Z",
    "updatedAt": "2022-09-26T12:06:28.000Z",
    "user": {
        "id": 2,
        "username": "hattori"
    }
  }
]
```

**GET** - Get All by ID  - `/tasks/:id`
 
Status Code: `200`

```
{
    "id": 1,
    "summary": "new task",    
    "date": "2022-09-26T12:06:28.000Z",
    "updatedAt": "2022-09-26T12:06:28.000Z",
    "user": {
        "id": 2,
        "username": "hattori"
    }
}

```

**PUT** - Update Task - `/tasks/:id`
 
```
{
    "summary": "update"
}
```

Status Code: `200`

```
{
    "id": 1,
    "summary": "updated",    
    "date": "2022-09-21T00:00:00.000Z",
    "updatedAt": "2022-09-26T12:06:28.000Z",
    "user": {
        "id": 2,
        "username": "hattori"
    }
}
```


**DELETE** - Delete by ID  - `/tasks/:id`
 
Status Code: `200`

```
{
    "id": 1,
    "summary": "new task",    
    "date": "2022-09-26T12:06:28.000Z",
    "updatedAt": "2022-09-26T12:06:28.000Z",
    "user": {
        "id": 2,
        "username": "hattori"
    }
}

```



## Docker

If you prefer, you can use docker-compose to launch the local enviroment with Redis, Mysql instances and the containerized version of this app.

```bash
docker-compose up -d
```

## Deploy to K8s

Push images to registry:
```bash
 #build and push API
 docker build -t task-api -f Dockerfile .  
 docker push ehattori/task-api
 
 #build and push Comsumer
 docker build -t task-consumer -f Dockerfile.consumer .
 docker push ehattori/task-consumer
 
 #deployment in k8s
 kubectl apply -f k8s/ingress.yaml
 kubectl apply -f k8s/service.yaml
 kubectl apply -f k8s/deployment.yaml
```

## TO-DO

- Implement a cache layer
- Implement a Swagger Documentation
- Automate deployment with CI-CD
- Store and manage JWT tokens and Users

## Stay in touch

- Author - [Eduardo Hattori](https://github.com/eHattori)
- Website - [https://medium.com/@eduardohattorif](https://medium.com/@eduardohattorif)
- Twitter - [@eHattori89](https://twitter.com/ehattori89)

## License

Nest is [MIT licensed](LICENSE).
