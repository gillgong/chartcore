(function() {

	var SeriersChart = function( chart_conf ) {
	
		Chart.call( this , chart_conf );
		this.polyLineDom = null;
		this.timeId = 0;
		this.cachPoints = null;
	};
	
	SeriersChart.prototype = new Chart();
	$.extend( SeriersChart.prototype , {
	
		'strokeWidth' : 1,
		
		'lineOpacity' : 0.2,
		
		'crossLineColor' : '#445566',
		
		'points' : [],
		
		'drawMain' : function() {
	
			this.drawLine();
			this.drawVerticalLine();
			this.drawLevelLine();
		},
		
		'prepareData' : function() {
			
			var datas = this.data.data,
				dataConf = null,
				points = [];
			
			datas.push();	
			for( var i=0 , len=datas.length ; i<len ; i++ ) {
				
				dataConf = this.getPositionFromValue( datas[i] );
				points.push( dataConf );
			}
			return points;
			
		},
		
		'drawVerticalLine' : function() {
			
			var axis_x = this.getAxis_x()[0],
				scaleInfo = axis_x._getScaleInfo(),
				mainAreaInfo = this.getChartMainInfo(),
				lineAttrs = {};
			
			for( var i=0 ; i<scaleInfo.length ; i++ ) {
				
				lineAttrs.x1 = scaleInfo[i].x;
				lineAttrs.y1 = 0;
				lineAttrs.x2 = scaleInfo[i].x;
				lineAttrs.y2 = mainAreaInfo.height;
				lineAttrs.stroke = this.crossLineColor;
				lineAttrs[ 'stroke-width' ] = 1;
				lineAttrs[ 'opacity' ] = this.lineOpacity;
				
				this.createElement( 'line' , lineAttrs , this.mainGroup );
			}
		},
		
		'drawLevelLine' : function() {
			
			var axis_y = this.getAxis_y()[0],
				scaleInfo = axis_y._getScaleInfo(),
				mainAreaInfo = this.getChartMainInfo(),
				lineAttrs = {};
			
			for( var i=0 ; i<scaleInfo.length ; i++ ) {
				
				lineAttrs.x1 = 0;
				lineAttrs.y1 = scaleInfo[i].y;
				lineAttrs.x2 = mainAreaInfo.width;
				lineAttrs.y2 = scaleInfo[i].y;
				lineAttrs.stroke = this.crossLineColor
				lineAttrs[ 'stroke-width' ] = 1;
				lineAttrs[ 'opacity' ] = this.lineOpacity;
				
				this.createElement( 'line' , lineAttrs , this.mainGroup );
			}
		},
		
		'drawLine' : function() {
			
			var points = this.prepareData(),polylinePoints='';
			
			this.cachPoints = points;	
			for( var i=0 ; i<points.length ; i++ ) {
				polylinePoints = polylinePoints + points[i].x + ','+ points[i].y + ' ';
			}
			
			this.polyLineDom = this.createElement( 'polyline' , {
				'points' : polylinePoints,
				'stroke' : "#ff0000",
				'stroke-width' : this.strokeWidth,
				'fill' : 'transparent'
			} , this.mainGroup );
		},

		'movePolyLine' : function() {

			var polylinePoints = '',points = this.cachPoints,points0 = points[0];

			for( var i=0 ; i<points.length-1 ; i++ ) {
				points[i].y = points[i+1].y;
			}
			points[ i ].y = points0.y;
			for( var i=0 ; i<points.length ; i++ ) {
				polylinePoints = polylinePoints + points[i].x + ','+ points[i].y + ' ';
			} 
	 		this.polyLineDom.setAttribute( 'points' , polylinePoints );
		},

		'anmationPolyLine' : function() {
			var self = this;
			if( this.timeId==0 ) {
				this.timeId = setInterval( function() {
					self.movePolyLine();
				} , 100 );	
			}
		},
		
		'stopAnmation' : function() {
			clearTimeout( this.timeId || 0 );
			this.timeId = 0;
		},

		'getPositionFromValue' : function( item ) {
			
			var dataGuid = this.data.axisGuide,
				axis_x = this.x_direction_Axis[0],
				x = 0,
				y = 0;

			x = axis_x.getCoorFromValue( item[ dataGuid['x'] ] );
			y = this.y_direction_Axis[0].getCoorFromValue( item[ dataGuid['y'] ] );
			return { 'x' : x , 'y' : y };
		}
		
	});
	
	SeriersChart.prototype.constructor = SeriersChart;
	window.SeriersChart = SeriersChart;
	
})();