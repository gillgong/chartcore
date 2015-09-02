(function() {
	
	/**
	*BarChart example as below:
	*	{
	*		chartConf : xxxx
	*	}
	*/
	var BarChart = function( chartConf ) {
		
		Chart.call( this , chartConf );
	};
	
	BarChart.prototype = new Chart();
	$.extend( BarChart.prototype ,{
		
		'BarWidth' : 10,
		
		'drawMain' : function() {
			
			this.drawBars();
 		},
		
		'drawBack' : function() {

			this.drawCrossLines();
		},
		
		'drawBars' : function( barAttrs ) {

			var data = this.data.data;
			
			for( var i=0,len=data.length ; i<len ; i++ ) {
				this.createElement('rect' , this.getBarAttrs( data[i] ) , this.mainGroup );
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
		
		'drawCrossLines' : function() {
			
			var axis_y = this.getAxis_y()[0],
				scaleInfo = axis_y._getScaleInfo(),
				width = this.getChartMainInfo().width,
				lineInfo = {};
			
			for( var i=0,len=scaleInfo.length ; i<len ; i++ ) {
			
				lineInfo.x1 = 0;
				lineInfo.y1 = scaleInfo[i].y;
				lineInfo.x2 = width;
				lineInfo.y2 = scaleInfo[i].y;
				this.createElement( 'line' , lineInfo , this.backGroup );
			}	
		}
	
	});
	BarChart.prototype.constructor = BarChart;
	window.BarChart = BarChart;
})();