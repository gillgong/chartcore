define(['jquery','axis'],function( $ , Axis ) {
	/**
	*This is a actual axis on "x" direction;
	*Axis_x Class is extends from Axis Class;
	*The argument axisConf is like below:
	*		{
	*			container : xxx,
    *			leftDis : xxx,
	*			topDis : xxx,
	*			bottomDis : xxx,
	*			axisWidth : xxx,
	*			topScaleDis : xxx,
	*			bottomScaleDis : xxx,
	*			scaleDirection : xxx,
	*			requireScaleNum : xxx
	*		}
	*/
	
	var Axis_y = function( container , axisConf ) {
	
		Axis.call(this,container,axisConf);
		this.bottomDis = axisConf.bottomDis;
		this.leftDis = axisConf.leftDis;
		this.topDis = axisConf.topDis;
		this.topScaleDis = axisConf.topScaleDis || 0;
		this.bottomScaleDis = axisConf.bottomScaleDis || 0;
		this.scaleDirection = axisConf.scaleDirection || 'right';
	};
	
	Axis_y.prototype = new Axis();
	
	$.extend( Axis_y.prototype , {
		
		'AXISCLASS' : 'axisContainer_y',
		
		'TYPE' : 'y',
		
		'constructor' : Axis_y ,
		
		'getRulerLength' : function() {
		
			var axisDom = this.getAxisDom();
			
			if( axisDom ) return axisDom.offsetHeight - this.topScaleDis - this.bottomScaleDis;
			return -1;
		},
		
		'getAxisMapping' : function() {

			var valueDis = this._getNiceMaxValue( this.maxValue ) - this._getNiceMinValue( this.minValue ),
				coorDis = this.getRulerLength(),
				coorPer = 0,
				valuePer = 0;
				
			if( this.mapping == null ) {
					
				coorPer = coorDis / valueDis;		
				valuePer = valueDis / coorDis;
				this.mapping = {
					'coorPer' : coorPer,
					'valuePer' : valuePer
				}
			}
			return this.mapping;
		},
 		
		/**
		*We must ensure that this axis begin at 0px;
		*The argument "coor" must be greater than 0 or less than 0;
		*/
		'getValueFromCoor' : function( coor ) {
			
			var valuePer = this.getAxisMapping().valuePer;
			
			return this._getNiceMinValue( this.minValue ) + valuePer*( coor - this.topScaleDis );
		}, 
		
		'getCoorFromValue' : function( value ) {
			
			var valueDis = value - this._getNiceMinValue( this.minValue ),
				coorPer = this.getAxisMapping().coorPer,
				coorTotalHeight = this.getAxisDom().offsetHeight;
				
			return coorTotalHeight - coorPer*valueDis - this.bottomScaleDis;	
		},
		
		'_setAxisPosition' : function() {
		
			var $axisContainer = $( this.getAxisContainer() ),
				$svgConatiner = $( this.svgConatiner ),
				outerHeight = this.$container.height();
			
			$axisContainer.css({
				'position' : 'absolute',
				'left' : 0,
				'top' : this.topDis,
				'width' : this.axisWidth+this.leftDis,
				'height' : outerHeight - this.topDis - this.bottomDis
			});
			$svgConatiner.css({
				'position' : 'relative',
				'overflow' : 'hidden',
				'left' : this.leftDis,
				'width' : this.axisWidth,
				'height' : '100%'
			});
			
			return this;
		},
		
		'beforeDrawAxis' : function() {
			
			var axisContainer = this.getAxisContainer();
			
			axisContainer.setAttribute( 'class' , this.AXISCLASS );
			this.$container.append( axisContainer );
		},
		
		'getAxisLineInfo' : function() {
		
			if( this.axisLineInfo==null ) {
				var outerWidth = this.$container.width(),
					outerHeight = this.$container.height(),
					begX = (this.scaleDirection==='right' ? 0 : this.axisWidth),
					endX = begX,
					endY = this.getAxisDom().offsetHeight,
					begY = 0;
			
				this.axisLineInfo = {
									'begX' : begX,
									'begY' : begY,
									'endX' : endX,
									'endY' : endY
						};
			}
				
			return this.axisLineInfo;
		},
		
		'_drawAxisLine' : function() {
			
			var axisLine = document.createElementNS( this.SVG_NS , 'line' ),
				lineInfo = this.getAxisLineInfo();
				
			axisLine.setAttribute( 'x1' , lineInfo.begX );
			axisLine.setAttribute( 'y1' , lineInfo.begY );
			axisLine.setAttribute( 'x2' , lineInfo.endX );
			axisLine.setAttribute( 'y2' , lineInfo.endY );
			
			this.lineGroup.appendChild( axisLine );
			return axisLine;
		},
		
		'_drawScaleLine' : function( scaleCount ) {
		
			var scaleInfo = this._getScaleInfo( scaleCount ),
				endY = 0;
				endX = (this.scaleDirection==='right' ? 0 : this.axisWidth),
				begY = 0,
				begX = (this.scaleDirection==='right' ? this.axisWidth : 0),
				path = '',
				pathDom = null;
			
			for( var i=0,len=scaleInfo.length ; i<len ; i++ ) {
			
				begY = this.getCoorFromValue( scaleInfo[i].value );
				endY = begY;
				path = path + 'M'+begX + ' ' + begY + ' L' + endX + ' ' + endY + ' ';
				scaleInfo[i].x = endX;
				scaleInfo[i].y = endY;
			}
			pathDom = document.createElementNS( this.SVG_NS , 'path' );
			pathDom.setAttribute( 'd' , path );
			this.scaleGroup.appendChild( pathDom );
			return pathDom;
		},
		
		'_drawScaleValue' : function() {
		
			var scaleInfo = this._getScaleInfo(),
				item = null,
				scaleNode = null,
				scaleNodeAttrs = {
					'class' : 'mark_y',
					'id' : null
				},
				scaleNodeCss = {
					'position' : 'absolute',
					'left':0,
					'top' : 0
				};
			
			for( var i=0,len=scaleInfo.length ; i<len ; i++ ) {
				
				item = scaleInfo[i];
				scaleNodeAttrs.id = 'mark_y_'+i;
				scaleNodeCss.left = item.x;
				scaleNodeCss.top = item.y;
				scaleNode = this._createScaleNode( scaleNodeAttrs , scaleNodeCss , this.displayValue( item ) );
				this.scaleNodeNiceFix( scaleNode , null );
			} 
		},
		
		'displayValue' : function( item ) {
		
			return item.value;
		},
		////////////////The user can override this method/////////////////////
		'scaleNodeNiceFix' : function( scaleNode , nodeAttrs ) {
		
			var nodeHeight = scaleNode.height(),
				y = scaleNode.css( 'top' ).replace( /px/ , '' ) - 0,
				width = scaleNode.css( 'width' ).replace( /px/ , '' ) - 0,
				scaleValueCss = {
					top : y-0.5*nodeHeight,
					left : this.leftDis - width
				}; 
				
			if( this.scaleDirection==='left' ) {
				scaleValueCss.left = this.leftDis+this.axisWidth;
			}
			scaleNode.css( scaleValueCss );
			return scaleNode;
		},
		/////////////////////////////////////////////////////////////////////////
		'destroy' : function() {
			
			var axisCom = $( this.getAxisContainer() );
			
			this.clearDynamicCache();
			this.bottomDis = null;
			this.leftDis = null;
			this.topDis = null;
			this.topScaleDis = null;
			this.bottomScaleDis = null;
			this.$container = null;
			this.data = null;
			axisCom.empty();
			axisCom.remove();
		},
 		
		'reDraw' : function() {
			
			var axisCom = $( this.getAxisContainer() );
			
			this.this.clearDynamicCache();
			axisCom.empty();
			axisCom.remove();
			this.draw();
		},
		
		'getAxisType' : function() {
			
			return this.TYPE;
		}
	
	} );
	//////////////////////////////////////////////////////////
	return Axis_y;
	/////////////////////////////////////////////////////////
});