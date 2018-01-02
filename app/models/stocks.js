'use strict';

require('dotenv').config();
var pg = require('pg');

var uri = process.env.DATABASE_URL; 
console.log("uri: " + uri);
var client = new pg.Client(uri);
client.connect();
console.log("client connected");
client.query('CREATE TABLE stocks(symbol TEXT PRIMARY KEY NOT NULL, dates TEXT[], open REAL[])', function (err,res) {
	client.end();
  console.log("table created");
});
