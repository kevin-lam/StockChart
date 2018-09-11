'use strict';

angular
	.module('stock')
	.controller('cardController', ['$scope', '$resource', 'stockService', 'socket', function ($scope, $resource, stockService, socket, $timeout) {
		var Stocks = $resource('/api/stocks', null, {
			query: {
				method: 'GET',
				isArray: true
			},
		});
		var StockId = $resource('/api/stocks/:symbol', null, {
			get: {
				method: 'GET',
				isArray: false
			},
		});

		// Deck of cards that store the stock card objects
		$scope.cards = {
			list: [],
			addCard: function(name) {
				if (!this.list.includes(name)) {
					this.list.push(name);
				}
			},
			removeCard: function(name) {
				var index = this.list.indexOf(name);
				if (index !== -1) {
					this.list.splice(index, 1);
				}
			}
		};

		/************************************************************************
			Load in existing stocks from the database
		*************************************************************************/
		function init() {
			$scope.queryStock();
		}

		/************************************************************************
			Retrieve the stock from the database after adding a new stock in
		*************************************************************************/
		$scope.getStock = function(symbol) {
			StockId.get({symbol: symbol}, 
				function (response, header, status, statusText) {
					stockService.addStock(response.rows[0]);
				}
			);	
		}

		/*************************************************************************
			Retrieve all stocks from the database
		**************************************************************************/
		$scope.queryStock = function() {
			Stocks.query(null, 
				function (response, header, status, statusText) {
					if (response.length > 0) {
						response.forEach(function(stock) {
							stockService.addStock(stock);			
							$scope.cards.addCard(stock.symbol);
						});			
					}
				}
			);
		}

		/**************************************************************************
			Add a single stock to the database
		***************************************************************************/
		$scope.addStock = function(symbol) {
			symbol = symbol.toUpperCase();
			Stocks.save({symbol: symbol}, function(){}, 
				// No such stock found
				function (error) {
					if (error.statusText == "Bad Request") {
						$scope.badStock = true;
						setTimeout(function() {
							$scope.badStock = false;
						}, 3000);
					}
				});
			$scope.tickerInput = null;
		};

		/**************************************************************************
			Remove a single stock from database
		***************************************************************************/
		$scope.removeStock = function(symbol) {
			Stocks.remove({symbol: symbol}, function(){});
		}

		// Sync up clients if there are any updates to the server
		socket.on('syncAdd', function(name) {
			$scope.getStock(name);
			$scope.cards.addCard(name);
		});
		socket.on('syncRemove', function(name) {
			stockService.removeStock(name);
			$scope.cards.removeCard(name);
		})

		init();
	}]);