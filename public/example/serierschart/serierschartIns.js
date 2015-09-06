require(['axis_x','axis_y','serierschart'],function(Axis_x,Axis_y,SeriersChart) {

	var data = {
				'axisGuide' : {
				'x' : 'aaa',
				'y' : 'bbb'
			},
			'data' : []
		};
			

	for( var i=0 ; i<=10 ; i++ ) {
		data.data.push( {
			'aaa' : i,
			'bbb' : Math.round( Math.random()*100 )
		} );
	}
	var container = $(".serierschart");
	var axis_x_conf = {
    	leftDis : 0,
		rightDis : 0,
		bottomDis : 5,
		axisWidth : 5,
		leftScaleDis : 40,
		rightScaleDis : 1,
		scaleDirection : 'up',
		requireScaleNum : 25
	};
			
	var axis_y_conf = {
    	leftDis : 0,
		topDis : 0,
		bottomDis : 5,
		axisWidth : 5,
		topScaleDis : 0,
		bottomScaleDis : 40,
		scaleDirection : 'right'
	};
			
	var chart_conf = {
		'container' : container,
		'axis_x' : [ new Axis_x( container , axis_x_conf ) ],
		'axis_y' : [ new Axis_y( container , axis_y_conf ) ]
	};
			
	var Chart = new SeriersChart( chart_conf );	
	Chart.setData( data );
	Chart.draw();
	$('#anmationplay').click(function( e ) {
		Chart.anmationPolyLine();
	});
	$('#stopAnmationplay').click(function( e ) {
		Chart.stopAnmation();
	});
});