// test/app.integration.spec.js

//import 'supertest'
//On va l'utiliser pour requêter l'app Express

const request = require('supertest');
const app = require('../app');
const db = require('../connection');

//describe regroupe une suite de tests
//titre (1er paramètre). tests écrits ds une fonction (2ème paramètre).
//it définit un test.

describe('Test routes', () => {
//truncate bookmark table before each test
  beforeEach(done => db.query('TRUNCATE bookmark', done));
  it('GET / sends "Hello World" as json', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { message: 'Hello World!'};
        expect(response.body).toEqual(expected);
        done();
      });
  });
  it('POST / send an error required fields as json', (done) => {
    request(app)
    .post('/bookmarks')
    .send({})
    .expect(422)
    .expect('Content-Type', /json/)
    .then(response => {
        const expected = {"error": "required field(s) missing"};
        expect(response.body).toEqual(expected);
        done();
    })
  })
  it('POST / sends posted data as json', (done) => {
    request(app)
    .post('/bookmarks')
    .send({url: 'https://jestjs.io', title: 'Jest'})
    .expect(201)
    .expect('Content-Type', /json/)
    .then(response => {
        const expected = { id: expect.any(Number), url: 'https://jestjs.io', title: 'Jest' };
        expect(response.body).toEqual(expected);
        done();
    })
    .catch(done);
  })
});

describe('GET /bookmarks/:id', () => {
  const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
  beforeEach((done) => db.query(
    'TRUNCATE bookmark', () => db.query(
      'INSERT INTO bookmark SET ?', testBookmark, done
    )
  ));
  it('GET / Error retrieving the bookmark', (done) => {
      request(app)
      .get('/bookmarks/2')
      .expect(404)
      .expect('Content-Type', /json/)
      .then(response => {
          const expected = { error: 'Bookmark not found' };
          expect(response.body).toEqual(expected);
          done();
      })
  });
  it('GET / Receive data as json', done => {
      request(app)
      .get('/bookmarks/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
          const expected = {"id": expect.any(Number), testBookmark};
          expect(response.body).toEqual(expected);
          done();
      })
  })
});