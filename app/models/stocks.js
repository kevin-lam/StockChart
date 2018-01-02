'use strict';

require('dotenv').config();
var pg = require('pg');

var uri = process.env.DATABASE_URL; 
var client = new pg.Client(uri);
client.connect();
client.query('CREATE TABLE stocks(symbol TEXT PRIMARY KEY NOT NULL, dates TEXT[], open REAL[])', function (err,res) {
	client.end();
});
