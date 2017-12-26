'use strict';

var req = require('request');
var util = require('util');

/******************************************************************************
	Server side handler which provides functionality for get, put, and remove API 
	requests.
*******************************************************************************/
function StockIDHandler (pool) {

	/** 
	* GET 
	* ------------------
	* Connect to the table. Get the row with requested stock symbol. Return the 
	* stock data. Close table client.
	**/
	this.getStock = function (request, response) {
		pool.connect((err, client, done) => {
			if (err) console.error(err);
			client.query('SELECT * FROM stocks WHERE symbol=$1', [request.params.symbol], 
				(err, result) => {
					response.json(result);
					client.release();
				});
		});
	};
}	

module.exports = StockIDHandler;