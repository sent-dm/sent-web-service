import express from 'express';

const app = express();
const port = process.env.PORT || 3000; // Use the environment port or 3000

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});