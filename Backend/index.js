const express = require('express');
const dotenv = require('dotenv');
const shortid = require('shortid');
const Database = require('./Database/database');
const Shortner = require('./models/Shortner');
const shortnerrouter = require('./routes/shortner');
dotenv.config();

const app = express();
app.use(express.json());
app.use('/',shortnerrouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await Database();
  console.log(`Server running on http://localhost:${PORT}`);
});
