requirejs.config({
	baseUrl: './',
	argv : '2015-9-5',
	shim : {
		underscore: {
	    	exports: '_'
		},
		jquery: {
			exports: '$'
		}
	},
	paths: {
		underscore : '3rdlib/underscore',
		jquery : '3rdlib/jquery1.11',
		text : '3rdlib/text',
	  	axis : 'chartlib/axis/axis',
	  	axis_x : 'chartlib/axis/axis_x',
	  	axis_y : 'chartlib/axis/axis_y',
	  	chart : 'chartlib/chart/chart',
	  	////////////////////////////////////////////////////////////////
	  	serierschart : 'example/serierschart/serierschart'
	}
});