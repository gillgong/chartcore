(function() {
	
	var PieChart = function( chart_conf ) {
	
		Chart.call( this , chart_conf );
	};
	
	PieChart.prototype = new Chart();
	$.extend( PieChart.prototype , {

		'R' : 150,
		
		'LableHtml' : '<li><span class="{class}"></span><em>{name}</em></li>',
		
		'drawMain' : function() {
		
			var mainAreaConf = this.getChartMainInfo(),
				posConf = {};
			
			posConf.x = mainAreaConf.x + 0.5*mainAreaConf.width;
			posConf.y = mainAreaConf.y + 0.5*mainAreaConf.height;
			this.drawPieCircle( posConf );
		},
		
		'drawFace' : function() {
		
			this.drawFaceLabel();
		},
		
		'drawPieCircle' : function( centerPos ) {
			
			var dataGuid = this.data.axisGuide,
				data = this.data.data,
				item = null,
				pathDom = null,
				group = null,
				transform = '',
				radian = 0,
				angle = 0;

			for( var i=0,len=data.length ; i<len ; i++ ) {
			
				item = data[i];
				radian = item[ dataGuid['y'] ]*2*Math.PI;
				pathDom = this.drawSectorCircle( centerPos , this.R , radian );
				transform = 'rotate('+ angle +','+centerPos.x+','+centerPos.y+')';
				group = this.createElement( 'g' , { 
													'class' : item['name'] , 
													'transform' : transform 
												} , this.mainGroup );
				group.appendChild( pathDom );
				angle = angle - item[ dataGuid['y'] ]*360;
			}
		},
		
		'overrideMethodsForAxis' : function( axis_x , axis_y ) {
			
			axis_x._drawScaleValue = function(){};
			axis_y._drawScaleValue = function(){};
		},
		
		'drawFaceLabel' : function() {
		
			var mainAreaConf = this.getChartMainInfo(),
				data = this.data.data,
				liHtml = '',
				levelFix = 170,
				vertalFix = 10,
				labelContainer = $('<ul></ul>');
				
			for( var i=0 ; i<data.length ; i++ ) {
				
				liHtml = this.LableHtml.replace( /{class}/ , data[i].name );
				liHtml = liHtml.replace( /{name}/ , data[i].name );
				labelContainer.append( liHtml );
				
			}
			
			labelContainer.css({	
				'left' : mainAreaConf.width - levelFix,
				'top' :	vertalFix
			});
			
			this.$chartFaceArea.append( labelContainer );
		}
	
	});
	
	PieChart.prototype.constructor = PieChart;
	window.PieChart = PieChart;
})();