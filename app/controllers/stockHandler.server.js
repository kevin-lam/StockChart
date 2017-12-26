'use strict';

var req = require('request');
var util = require('util');

/******************************************************************************
	Server side handler which provides functionality for get, put, and remove API 
	requests.
*******************************************************************************/
function StockHandler (pool, io) {

	this.getStock = function (request, response) {
		pool.connect()
			.then(client => {
				return client.query('SELECT * FROM stocks')
				.then(result => {
					response.json(result.rows);
					client.release();	
				})
				.catch(error => {
					response.status(404).send({status:404, message: error, type: 'internal'});
					client.release();					
				})
			})
	}

	/**
	* PUT
	* ------------------
	* Initialize GET request options from remote stocks server. Send a get request
	* to server. Parse the result and retrieve the stock dates and vals. Insert it
	* into the db table and return the result back to the client.
	*/
	this.addStock = function (request, response) {
		var options = initOptions(request);
		req.get(options, (err, res, body) => {
			var symbol = request.body.symbol;
			var stockObject = JSON.parse(body);
			var dates = getDates(stockObject);
			var openPrices = getVals(stockObject); 
			if (stockObject.hasOwnProperty("Error Message")) {
				console.error(err);
				response.status(400).send({status:400, message: "Bad stock symbol.", type: 'internal'});
			} else {
				pool.connect()
					.then(client => {
							return client.query('INSERT INTO stocks (symbol, dates, open) VALUES($1, $2, $3)', [symbol, dates, openPrices])
							.then(result => {
								response.json(result.rows[0]);
								io.emit('syncAdd', symbol);
								client.release();
							})
							.catch(error => {
								console.error(error);
								response.status(403).send({status:403, message: error, type: 'internal'});
								client.release();
							})
					})
			}
		});
	};

	/**
	* REMOVE request
	* --------------------
	* Connect to the table. Remove the stock corresponding to the requested symbol.
	* Return the deleted data. Close the table client.
	**/
	this.removeStock = function (request, response) {
		var symbol = request.query.symbol;
		pool.connect()
			.then(client => {
				return client.query('DELETE FROM stocks WHERE symbol=$1', 
					[symbol])
					.then(result => {
						client.release();
						io.emit('syncRemove', symbol);
						response.json(result);	
					})
					.catch(error => {
						client.release();
						response.json(error);
					})
			})
	}
}	


/*******************************************************************************
	Initialize the options needed for the GET request from the server
*******************************************************************************/
function initOptions(request) {
	var options = {
			url: process.env.STOCKSURI,
			qs: {
				function: 'TIME_SERIES_DAILY',
				symbol: request.body.symbol,
				outputsize: 'full',
				datatype: 'json',
				apikey: process.env.STOCKSKEY 
			}
		}

	return options;
}

/*******************************************************************************
	Parse the stock dates from the json object
*******************************************************************************/
function getDates(stockObject) {
	var stockTimeSeries = getTimeSeries(stockObject);
	var dates = Object.keys(stockTimeSeries)
	if (dates.length > 0) {
		return Object.keys(stockTimeSeries);
	}
	return [];
} 

function getVals(stockObject) {
	var stockTimeSeries = getTimeSeries(stockObject);
	var dates = Object.keys(stockTimeSeries)
	if (dates.length > 0) {
		var stockOpenVals = [];
		for (var dailyStock in stockTimeSeries) {
			stockOpenVals.push(parseFloat(stockTimeSeries[dailyStock]["1. open"]));
		}
		return stockOpenVals;
	}
	return [];
}

function getTimeSeries(stockObject) {
	if (!stockObject.hasOwnProperty('Time Series (Daily)')) {
		return [];
	}

	return stockObject["Time Series (Daily)"];
}

module.exports = StockHandler;