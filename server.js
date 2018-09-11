/*******************************************************************************
	STOCKS
	-----------------
	Web application which displays a stock historical timeline. Users
	can add new stock ticker symbols which allows new timeline data to be displayed.
	The data will be synced across various user sessions.
*******************************************************************************/


'use strict';

var express = require('express'),
	routes = require('./app/routes/routes.js'),
	{Pool} = require('pg'),
  bodyParser = require('body-parser');

var app = express();
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
require('dotenv').load();
var port = process.env.PORT;
var server = require('http').createServer(app).listen(process.env.PORT || 3000);
var io = require('socket.io').listen(server);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

routes(app, pool, io);	
