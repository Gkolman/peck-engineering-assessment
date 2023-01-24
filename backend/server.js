const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require("cors");
const port = 3000
const { sequelizeConn } = require('./database')
const { FoodTrucks } = require('./controllers')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());

/**
 * @description Defines the server routes, CORS policy, and sets headers.
 */

app.use('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/food/trucks/:id', async function (req, res) {
  return await FoodTrucks.getWithId(req, res, sequelizeConn)
});

app.get('/food/trucks', async function (req, res) {
  return await FoodTrucks.getList(req, res, sequelizeConn)
});

app.get('/food', async function (req, res) {
  return await FoodTrucks.getWithKeyWord(req, res, sequelizeConn)
});

app.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
})