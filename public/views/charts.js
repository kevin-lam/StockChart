var seriesOptions = [];
var seriesCounter = 0;
var names = ['MSFT', 'AAPL', 'GOOG'];


function createChart () {
	Highcharts.stockChart('chart-container', {
    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true
      }
    },
    credits: {  
      enabled: false
    },
    exporting: {
      enabled: false
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
    },
    series: seriesOptions
  });
}

$.each(names, function (i, name) {
  $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?', function (data) {

    seriesOptions[i] = {
      name: name,
      data: data
    };

    seriesCounter += 1;

    if (seriesCounter === names.length) {
      createChart();    
    }
  });
});
