'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const Processing = require('./src/Processing');
const app = express();
const PORT = process.env.PORT || 6666;

// const processing = new Processing('ws://localhost:8800/ws');
const processing = new Processing('ws://bspsd-mock:8800/ws');

app.use(bodyParser.json());

app.get('/accounts', function (req, res) {
  console.log('token', req.headers.token);
  processing
    .checkAuth(req.headers.token)
    .then(json => {
      return processing
        .listAccounts(json.data.clientid);
    })
    .then(json => {
      res.send(JSON.stringify(json.data));
    })
    .catch(error => {
      res.status(400).send(JSON.stringify(error));
    });
});

app.post('/accounts', function (req, res) {
  processing
    .checkAuth(req.headers.token)
    .then(json => {
      return processing
        .openAccount(json.data.clientid);
    })
    .then(json => {
      res.send(JSON.stringify(json.data));
    })
    .catch(error => {
      res.status(400).send(JSON.stringify(error));
    });
});

app.delete('/accounts/:id', function (req, res) {
  processing
    .checkAuth(req.headers.token)
    .then(json => {
      if (!json.data.clientid) {
        throw new Error('Forbidden');
      }
      return processing
        .closeAccount(req.params.id);
    })
    .then(json => {
      res.send(JSON.stringify(json.data));
    })
    .catch(error => {
      res.status(400).send(JSON.stringify(error));
    });
});

app.get('/flag/:id', function (req, res) {
  res.send({id: req.params.id.split("").reverse().join('')});
});

app.post('/flag', function (req, res) {
  res.send({id: req.body.id.split("").reverse().join('')});
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err);
});

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
