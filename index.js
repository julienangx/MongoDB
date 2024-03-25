const express = require('express');
const connectDB = require('./configuration/bdd');
const challengesRouter = require('./routes/routeschallenge');

const app = express();

connectDB();

app.use(express.json());

app.use('/challenges', challengesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
