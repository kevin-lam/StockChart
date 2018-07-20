'use strict';

var stockSeries = [];

angular
	.module('stock')
	.controller('chartController', ['$scope', 'socket', function ($scope, socket) {

		// Sync up the chart data when there are changes from the server
		$scope.$on('add', function(event, args) {
			$scope.chartConfig.addStock(args);
		});

		$scope.$on('remove', function(event, args) {
			$scope.chartConfig.removeStock(args);
		});

		$scope.chartConfig = {
			chartType: 'stock',
			plotOptions: {
      	series: {
        	compare: 'percent',
        	showInNavigator: true
      	}
    	},
      chart: {
        marginBottom: 0,
        spacingBottom: 0
      },
    	credits: {  
      	enabled: false
    	},
    	exporting: {
      	enabled: false
    	},
      navigator: {
        enabled: false,
        margin: 0
      },
    	title: {
      	text: 'STOCKS'
    	},
    	tooltip: {
      	backgroundColor: '#FCFFC5',
      	borderColor: 'black',
      	borderRadius: 10,
      	borderWidth: 3,
      	crosshairs: [true]
    	},
    	yAxis: {
      	labels: {
        	formatter: function () {
          	return (this.value > 0 ? '+' : '') + this.value + '%';
        	}
      	},
        tickAmount: 8
    	},
    	series: stockSeries,
    	addStock: function(stock) {
    		this.series.forEach(function (element) {
    			if (element.name === stock.name) {
    				return;
    			}
    		});
    		this.series.push(stock);
    	},
    	removeStock: function(name) {
				for (var i=this.series.length - 1; i >=0; i--) {
					if (this.series[i].name === name) {
						this.series.splice(i, 1);
					}
				}
    	}
		}
	}]);
			