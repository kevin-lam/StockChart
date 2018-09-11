'use strict';

var StockHandler = require(process.cwd() + '/app/controllers/stockHandler.server.js');
var StockIDHandler = require(process.cwd() + '/app/controllers/stockIDHandler.server.js');
module.exports = function (app, pool, io) {
	
	var stockHandler = new StockHandler(pool, io);
	var stockIDHandler = new StockIDHandler(pool);

	app.route('/')
		.get(function (request, response) {
			response.sendFile(process.cwd() + '/public/index.html');
		});

	app.route('/api/stocks')
		.get(stockHandler.getStock)
		.post(stockHandler.addStock)
		.delete(stockHandler.removeStock);

	app.route('/api/stocks/:symbol')
		.get(stockIDHandler.getStock);
};