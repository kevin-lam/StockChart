'use strict';

require('dotenv').config();
var pg = require('pg');

var user = process.env.PGUSER;
var pw = process.env.PGPASSWORD;
var db = process.env.PGDATABASE;
var uri = 'postgres://' + user + ':' + pw + '@localhost/' + db;
var client = new pg.Client(uri);
client.connect();
client.query('CREATE TABLE stocks(symbol TEXT PRIMARY KEY NOT NULL, dates TEXT[], open REAL[])', function (err,res) {
	client.end();
});
