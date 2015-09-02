(function() {

	var SeriersBarChart = function() {
	
		Chart.call( this , chart_conf );
	};
	
	SeriersBarChart.prototype = new Chart();
	$.extend( SeriersBarChart.prototype , {
		
		'BarWidth' : 10,
		
		'drawMain' : function() {
			
			this.drawBars();
		},
		
		'overrideMethodsForAxis' : function( axis_x , axis_y ) {
		
			axis_x._getScaleInfo = function( scaleCount ) {
			
				if( this.scaleInfo==null ) {
					var innerData = this.data.data,
						millseconds = null,
						dataGuid = this.data['axisGuide'],
						item = null,
						scaleInfo = [];
					
					for( var i=0 ; i<innerData.length ; i++ ) {
						
						item = innerData[i];
						millseconds = this.getMilliseconds( item[ dataGuid['x'] ] );
						scaleInfo.push( { 'value' : millseconds , 'x':0 , 'y':0 } );
					}
					this.scaleInfo = scaleInfo;
				}
				return this.scaleInfo;
			};
		},
		
		'drawBars' : function() {
			
			var innerData = this.data.data,
				barAttrs = null;
			
			for( var i=0 ; i<innerData.length ; i++ ) {
				
				barAttrs = this.getBarAttrs( innerData[i] );
				this.createElement('rect' , barAttrs , this.mainGroup );
			}
		},
		
		'getBarAttrs' : function( dataItem ) {
		
			var posAttrs = this.getPositionFromValue( dataItem ),
				mainAreaHeight = this.getChartMainInfo().height;
			
			return {
				'x' : posAttrs.x - this.BarWidth,
				'y' : posAttrs.y,
				'width' : 2*this.BarWidth,
				'height' : mainAreaHeight - posAttrs.y 
			}
		},
		
		'getPositionFromValue' : function( item ) {
			
			var dataGuid = this.data.axisGuide,
				axis_time_x = this.x_direction_Axis[0],
				x = 0,
				y = 0,
				millseconds = 0;
				
			millseconds = axis_time_x.getMilliseconds( item[ dataGuid['x'] ] );	
			x = axis_time_x.getCoorFromValue( millseconds );
			y = this.y_direction_Axis[0].getCoorFromValue( item[ dataGuid['y'] ] );
			return { 'x' : x , 'y' : y };
		}
		
	});
	
	SeriersBarChart.prototype.constructor = SeriersBarChart;
	window.SeriersBarChart = SeriersBarChart;
	
})();