'use strict';

angular
	.module('stock')
	.service('stockService',['$rootScope', 'socket', function ($rootScope, socket) {

    /**************************************************************************
      Joins each stock date and stock open price into a single array
    ***************************************************************************/
    function toMultidimensional(dates, openVals) {  
      var multiDimArray = [];
      for (var i=dates.length - 1; i >= 0; i--) {
        multiDimArray.push([new Date(dates[i]).getTime(), openVals[i]]);
      }
      return multiDimArray;
    }

    /***************************************************************************
      Send results to chart controller
    ***************************************************************************/
    this.send = function(msg, data) {
      $rootScope.$broadcast(msg, data);
    }

    /**************************************************************************
      Prepare stock data to send to controller
    ***************************************************************************/
		this.addStock = function (stock) {
      var name = stock.symbol;
      var data = toMultidimensional(stock.dates, stock.open); 
      var stockInfo = {name : name, id : name, data : data};
      this.send('add', stockInfo);
		}

    /**************************************************************************
      Prepare stock data to send to controller
    **************************************************************************/
		this.removeStock = function (stock) {
      var name = stock;
      this.send('remove', name);
		}
	}])