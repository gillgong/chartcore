(function() {
	/**
	*Here is the chart base , any actual charts should extend on this chart.
	*The argument "chartBaseConf" as below :
	*	{
	*		'container' : xxx,
	*		'axis_x' : xxx,
	*		'axis_y' : xxx,
	*	}
	*
	*/
	var Chart = function( chartBaseConf ) {

		this.x_direction_Axis =[];
		this.y_direction_Axis = [];
		this.data = null;
		this.backGroup = null;
		this.mainGroup = null;
		this.faceGroup = null;
		this.$chartMainArea = null;
		this.$chartFaceArea = null;
		/**
		*this.mainArea as below:
		*	{
		*		'x' : xxx,
		*		'y' : xxx,
		*		'width' : xxx,
		*		'height' : xxx,
		*	}
		*/
		this.mainArea = {
			'x' : Number.MAX_VALUE,
			'y' : Number.MAX_VALUE,
			'width' : Number.MIN_VALUE,
			'height' : Number.MIN_VALUE
		};
		if( chartBaseConf ) {
			this.$container = $(chartBaseConf.container);
			this.x_direction_Axis = chartBaseConf.axis_x;
			this.y_direction_Axis = chartBaseConf.axis_y;
		}
		this._init();
	};
	
	Chart.prototype = {
	
		//Some constant as below///////////////////////////
		'XMLNS' : 'http://www.w3.org/2000/svg',
		'SVG_NS' : "http://www.w3.org/2000/svg",
		'RADIAN' : 0.017453293,
		///////////////////////////////////////////////////
		
		/**
		* Data format as below:
		*	{
		*		'axisGuide' : {
		*			'x' : 'aaa',
		*			'y' : 'bbb'
		*		},
		*		'data' : [
		*			{
		*				'aaa' : xxx,
		*				'bbb' : xxx
		*			},
		*			{
		*				'aaa' : xxx,
		*				'bbb' : xxx
		*			},
		*			{
		*				'aaa' : xxx,
		*				'bbb' : xxx
		*			}
		*		]
		*	}
		*
		*
		*
		*/
		'setData' : function( data ) {
			
			this.data = data;
		},
		
		'processData' : function( data ) {
		
			return data;
		},
		
		'_init' : function() {
		
			var axis_x = this.x_direction_Axis[0],
				axis_y = this.y_direction_Axis[0];
			
			this.overrideMethodsForAxis( axis_x , axis_y );
		},
		
		/**
		*Here is the chart area :
		*<div class="chartMainArea">
		*	<svg>
		*		<g class="backGroup"></g>
		*		<g class="mainGroup"></g>
		*		<g class="faceGroup"></g>
		*	</svg>
		*</div>
		* <div class="chartFaceArea"></div>
		*/
		'_render' : function() {
		
			var mainArea = null,
				$chartMainArea = null,
				$chartFaceArea = null,
				backGroup = null,
				mainGroup = null,
				faceGroup = null,
				svgDom = null;
		
			this.drawAxis_x();
			this.drawAxis_y();
			mainArea = this.getChartMainInfo();
			$chartMainArea = $( '<div class="chartMainArea"></div>');	
			$chartFaceArea = $( '<div class="chartFaceArea"></div>');
			svgDom = this.createElement( 'svg' , {
				'version' : '1.1',
				'width' : '100%',
				'height' : '100%',
				'xmlns' : this.XMLNS
			} );
			
			backGroup = this.createElement( 'g' , {
				'class' : 'backGroup'
			} ,svgDom );
			mainGroup = this.createElement( 'g' , {
				'class' : 'mainGroup'
			} ,svgDom );
			faceGroup = this.createElement( 'g' , {
				'class' : 'faceGroup'
			} ,svgDom );
			$chartMainArea.css({
				'position' : 'absolute',
				'left' : mainArea.x,
				'top' : mainArea.y,
				'width' : mainArea.width,
				'height' : mainArea.height
			});
			$chartFaceArea.css({
				'position' : 'absolute',
				'left' : mainArea.x,
				'top' : mainArea.y,
				'width' : mainArea.width,
				'height' : mainArea.height
			});
			$chartMainArea.append( svgDom );
			this.$container.append( $chartMainArea );
			this.$container.append( $chartFaceArea );
			this.backGroup = backGroup;
			this.mainGroup = mainGroup;
			this.faceGroup = faceGroup;
			this.$chartMainArea = $chartMainArea;
			this.$chartFaceArea = $chartFaceArea;
			return this;
		},
		
		'createElement' : function( tagName , attrs , parentDom , isSvgDom ) {
			
			var dom = null,
				isSvgDom = (isSvgDom==null || isSvgDom ) ? true : false;
			
			if ( document.createElementNS && isSvgDom ) {
				dom = document.createElementNS(this.SVG_NS, tagName);
			} else {
				dom = document.createElement(tagName);
			}
			
			if( attrs != null ) {
				for( var ele in attrs ) {
					
					dom.setAttribute( ele , attrs[ele] );
				}
			}
			if( parentDom ) {
				parentDom.appendChild( dom );
			}
			return dom;
		},
		
		'getChartMainInfo' : function() {
			
			var axis_x = this._getAxis_x_info(),
				axis_y = this._getAxis_y_info();
			
			this.mainArea['x'] = axis_x['begX'];
			this.mainArea['width'] = axis_x['endX'] - axis_x['begX'];
			this.mainArea['y'] = axis_y['begY'];
			this.mainArea['height'] = axis_y['endY'] - axis_y['begY'];
			return this.mainArea;
		},
		
		'draw' : function() {
			
			this._render();
			///////implement by the user////////////////
			this.beforeDraw();
			////////////////////////////////////////////
			this.drawBack();
			this.drawMain();
			this.drawFace();
			//////implement by the user////////////////
			this.afterDraw();
			///////////////////////////////////////////

			return this;
		},
		
		'_getAxis_x_info' : function() {
			
			var len = this.x_direction_Axis.length,
				axis_x_info = this.mainArea,
				axisLineInfo = null,
				axisObj = null;
			
			for( var i=0 ; i<len ; i++ ) {
				axisObj = this.x_direction_Axis[i];
				axisLineInfo = axisObj.getAxisLineInfo();
				axis_x_info['begX'] = axisObj.leftDis + axisLineInfo['begX'];
				axis_x_info['endX'] = axis_x_info['begX'] + (axisLineInfo['endX']-axisLineInfo['begX']);
			}
			return axis_x_info;
		},
		
		'_getAxis_y_info' : function() {
		
			var len = this.y_direction_Axis.length,
				axis_y_info = this.mainArea,
				allInfo = null,
				axisObj = null;
			
			for( var i=0 ; i<len ; i++ ) {
				axisObj = this.y_direction_Axis[i];
				allInfo = axisObj.getAxisLineInfo();
				axis_y_info['begY']	= axisObj.topDis + allInfo['begY'];
				axis_y_info['endY']	= axis_y_info['begY'] + (allInfo['endY']-allInfo['begY']);
			}
			return axis_y_info;
		},
		
		'drawAxis_x' : function() {
		
			var len = this.x_direction_Axis.length;
			
			for( var i=0 ; i<len ; i++ ) {
				this.x_direction_Axis[i].setData( this.data );
				this.x_direction_Axis[i].draw();
			}
		},
		
		'drawAxis_y' : function() {
		
			var len = this.y_direction_Axis.length;
			
			for( var i=0 ; i<len ; i++ ) {
				this.y_direction_Axis[i].setData( this.data );
				this.y_direction_Axis[i].draw();
			}
		},
		
		'getPositionFromValue' : function( item ) {
			
			var dataGuid = this.data.axisGuide,
				x = 0,
				y = 0;
				
			x = this.x_direction_Axis[0].getCoorFromValue( item[ dataGuid['x'] ] );
			y = this.y_direction_Axis[0].getCoorFromValue( item[ dataGuid['y'] ] );
			return { 'x' : x , 'y' : y };
		},
		
		'destroyTopChart' : function() {
			
			this.$chartMainArea.empty().remove();
			this.$chartFaceArea.empty().remove();
			this.$chartFaceArea = null;
			this.$chartMainArea = null;
			this.data = null;
			this.backGroup = null;
			this.mainGroup = null;
			this.faceGroup = null;
			this.mainArea = null;
			
			for( var i=0 ; i<this.x_direction_Axis.length ; i++ ) {
				this.x_direction_Axis[i].destroy();
			}
			for( var j=0 ; j<this.y_direction_Axis.length ; j++ ) {
				this.y_direction_Axis[j].destroy();
			}
			this.x_direction_Axis =null;
			this.y_direction_Axis = null;
		},
		
		'getAxis_x' : function() {
			
			return this.x_direction_Axis;
		},
		
		'getAxis_y' : function() {
		
			return this.y_direction_Axis;
		},
		
		/**
		*This function is used for draw a arc.But you should provide some 
		*arguments as below:
		*	1. centerPos : the center point of the circle.
		*	2. r : the radius of the circle.
		*	3. a : the angle you want.
		*	4. some attributes for the path Dom.
		*It is worth to clear that this function shouldn't draw the full circle,
		*if you want draw a full circle , you should create a <g> and use this
		*attribute : "transform : rotate( angle , x , y)"
		*/
		'drawSectorCircle' : function( centerPos , r , a , attrs ) {
			
			var _a = 0.5*a,
				path = '';
				angleFlag = ( a>=Math.PI )? 1:0,
				x = centerPos.x,
				y = centerPos.y,
				oneEdgePointX = x + r,
				oneEdgePointY = y,
				otherEdgePointX = x + Math.cos(a)*r,
				otherEdgePointY = y - Math.sin(a)*r;
			
			path = 'M'+(x+','+y)+
					' L'+(oneEdgePointX+','+oneEdgePointY)+
					' A'+( r+','+r+','+0+','+angleFlag+','+0+','+otherEdgePointX+','+otherEdgePointY )+ 
					' Z';
					
			attrs = attrs==null ? {}:attrs;		
			attrs.d = path;
			return this.createElement( 'path' , attrs );
		},
		
		/**
		*If you want to draw a dotted line,
		*please use the attribute : "stroke-dasharray: x,x".
		*Example as below:
		*	var lineDom = xxx;
		*	lineDom.setAttribute( "stroke-dasharray" , 'x,x' );
		*/
		'drawLine' : function() {},
		'drawPolyline' : function() {},
		'destroy' : function() {},
		'reDraw' : function() {},
		'drawBar' : function() {},
		'drawCircle' : function() {},
		'drawMain' : function() {},
		'drawFace' : function() {},
		'drawBack' : function() {},
		'beforeDraw' : function() {},
		'afterDraw' : function() {},
		'overrideMethodsForAxis' : function( axis_x , axis_y ) {} 
	};
	
	Chart.prototype.constructor = Chart;
	window.Chart = Chart;
})();