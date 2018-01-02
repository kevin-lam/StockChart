'use strict';

angular
.module('stock', ['ngResource', 'highcharts-ng'])
.factory('socket',['$rootScope', function($rootScope) {
	var socket = io.connect('https://stock-chart-kevin-lam.herokuapp.com/');
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				})
			});
		},
		emit: function (eventName, data) {
			socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })		
		}
	}	
}]);
