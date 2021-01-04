// index.js
const app = require('./app');

const port = process.env.port || 3000;

/* app.get("/", (req, res) => {
  res.status(200).json({ message: 'Hello World!'});
}); */

// app.get('/', (_, res) => res.json({ message: 'Hello World!' }));

app.listen(3000, (err) => {
  if (err) {
    throw new Error(`An error occurred: ${err.message}`);
  }
  console.log(`Server is listening on ${port}`);
});
