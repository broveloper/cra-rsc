require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();

require('./setup')(app);

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(process.env.PORT || 3000, err => {
  if (err) {
    console.error(`Server start error`, err);
    process.exit();
  } else {
    console.log('Successfully started application server.');
  }
});