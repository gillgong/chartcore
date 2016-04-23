/**
 *框架加载配置项
 */
require.config({
	baseUrl: './',
	argv : '2015-9-5',
	shim : {
		underscore: {
	    	exports: '_'
		},
		jquery: {
			exports: '$'
		},
		g4:{
			exports:'G4'
		}
	},
	paths: {
		underscore : '3rdlib/underscore',
		jquery : '3rdlib/jquery1.11',
		text : '3rdlib/text',
		css:'3rdlib/css',
		util:'utils/util',
		g4:'g4.seed',

	  	axis : 'chartlib/axis/axis',
	  	axis_x : 'chartlib/axis/axis_x',
	  	axis_y : 'chartlib/axis/axis_y',
	  	chart : 'chartlib/chart/chart'
	}
});

////////////////////////////////////////////////////////////
require.config({

	baseUrl:'../',

	paths: {

		chartCore:'g4',

		pieChart:'example/piechart/chart',
		pieChartData:'example/piechart/data',
		pieChartConf:'example/piechart/config',
		pieChartIndex:'example/piechart/index',
		pieChartCss:'example/piechart/chart',

		barChart:'example/barchart/chart',
		barChartData:'example/barchart/data',
		barChartConf:'example/barchart/config',
		barChartIndex:'example/barchart/index',
		barChartCss:'example/barchart/chart'
	}
});

require(['g4','underscore','jquery'],function(G4,_,$) {
	
	var chartType = G4.p('type');
	var chartLinkName = null;

	if(chartType=='pie') {
		chartLinkName = 'pieChartIndex';
	}else if(chartType==='bar') {
		chartLinkName = 'barChartIndex';
	}
	
	if(chartLinkName) {
		require([chartLinkName],function(chart) {
			chart.draw();
		});
	}else{
		console.log('参数错误');
	}	
});