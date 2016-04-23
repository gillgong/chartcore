define(['axis_x',
	'axis_y',
	'barChartData',
    'barChart',
	'barChartConf','css!barChartCss'],
	function(Axis_x,Axis_y,data,BarChart,conf) {

    var container = $(".web-chart-wrapper");
    var chart_conf = {
        'container': container,
        'axis_x': [new Axis_x(container, conf)],
        'axis_y': [new Axis_y(container, conf)]
    };

    var Chart = new BarChart(chart_conf);
    Chart.setData(data);

    return Chart;
});
