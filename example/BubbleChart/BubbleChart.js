(function() {

	var BubbleChart = function( chartConf ) {
		
		Chart.call( this , chartConf );
	};
	
	BubbleChart.prototype = new Chart();
	$.extend( BubbleChart.prototype , {
		
		'R' : 10,
		
		'drawCircle' : function( pos , r ) {
			
			var circleAttrs = {
				'cx' : pos.x,
				'cy' : pos.y,
				'r' : r
			};
			
			return this.createElement( 'circle' , circleAttrs , this.mainGroup );
		},
		
		'drawMain' : function() {
			
			var data = this.data.data,
				posAttrs = null;
			
			for( var i=0,len=data.length ; i<len ; i++ ) {
				posAttrs = this.getPositionFromValue( data[i] );
				this.drawCircle( posAttrs , this.R );
			}
		},
		
		'destroy' : function() {
			
			this.destroyTopChart();
			this.$container.empty();
			this.$container = null;
		},
		
		'reDraw' : function() {
			
			var axis_x = null,
				axis_y = null,
				axisCon = null;
			
			this.$chartMainArea.remove();
			this.$chartFaceArea.remove();
			this.backGroup = null;
			this.mainGroup = null;
			this.faceGroup = null;
			this.$chartMainArea = null;
			this.$chartFaceArea = null;
			for( var i=0 ; i<this.x_direction_Axis.length ; i++ ) {
				axis_x = this.x_direction_Axis[i];
				axisCon = $(axis_x.getAxisContainer());
				axisCon.remove();
				axis_x.clearDynamicCache();
			}
			for( var j=0 ; j<this.y_direction_Axis.length ; j++ ) {
				axis_y = this.y_direction_Axis[j];
				axisCon = $(axis_y.getAxisContainer());
				axisCon.remove();
				axis_y.clearDynamicCache();
			}
			this.draw();
		}
	} )
	
	BubbleChart.prototype.constructor = BubbleChart;
	window.BubbleChart = BubbleChart;
})();