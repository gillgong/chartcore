(function() {
	/**
	*This is a actual axis on "x" direction;
	*Axis_x Class is extends from Axis Class;
	*The argument axisConf is like below:
	*		{
	*			container : xxx,
    *			leftDis : xxx,
	*			rightDis : xxx,
	*			bottomDis : xxx,
	*			axisWidth : xxx,
	*			leftScaleDis : xxx,
	*			rightScaleDis : xxx,
	*			scaleDirection : xxx,
	*			requireScaleNum : xxx
	*		}
	*/
	
	var Axis_x = function( container , axisConf ) {
	
		Axis.call(this,container,axisConf);
		if( axisConf ) {
		
			this.bottomDis = axisConf.bottomDis==null? 0 : axisConf.bottomDis;
			this.leftDis = axisConf.leftDis==null? 10 : axisConf.leftDis;
			this.rightDis = axisConf.rightDis || 10;
			this.leftScaleDis = axisConf.leftScaleDis || 0;
			this.rightScaleDis = axisConf.rightScaleDis || 0;
			this.scaleDirection = axisConf.scaleDirection || 'up';
		}
	};
	
	Axis_x.prototype = new Axis();
	
	$.extend( Axis_x.prototype , {
		
		'AXISCLASS' : 'axisContainer_x',
		
		'TYPE' : 'x',
		
		'constructor' : Axis_x ,
		
		'getRulerLength' : function() {
		
			var axisDom = this.getAxisDom();
			
			if( axisDom ) {
				return axisDom.offsetWidth - this.leftScaleDis - this.rightScaleDis;
			}
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
			
			return this._getNiceMinValue( this.minValue ) + valuePer*( coor - this.leftScaleDis );
		}, 
		
		'getCoorFromValue' : function( value ) {
			
			var valueDis = value - this._getNiceMinValue( this.minValue ),
				coorPer = this.getAxisMapping().coorPer;
			
			return this.leftScaleDis + coorPer*valueDis;	
		},
		
		'_setAxisPosition' : function() {
		
			var $axisContainer = $( this.getAxisContainer() ),
				$svgConatiner = $( this.svgConatiner ),
				outerWidth = 0,
				outerHeight = 0;
				
			outerWidth = this.$container.width();
			outerHeight = this.$container.height();
			
			$axisContainer.css({
				'position' : 'absolute',
				'left' : this.leftDis,
				'top' : outerHeight - this.bottomDis - this.axisWidth,
				'width' : outerWidth - this.leftDis-this.rightDis,
				'height' : this.axisWidth+this.bottomDis
			});
			$svgConatiner.css({
				'position' : 'relative',
				'overflow' : 'hidden',
				'height' : this.axisWidth
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
					begX = 0,
					begY = 0,
					endX = 0,
					endY = 0;
					
				begX = 0;
				begY = (this.scaleDirection==='up' ? this.axisWidth : 0);
				endX = this.getAxisDom().offsetWidth;
				endY = begY;
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
				endX = 0,
				endY = (this.scaleDirection==='up'? this.axisWidth : 0),
				begY = (this.scaleDirection==='up'? 0 : this.axisWidth ),
				begX = 0,
				path = '',
				pathDom = null;
			
			for( var i=0,len=scaleInfo.length ; i<len ; i++ ) {
				
				begX = this.getCoorFromValue( scaleInfo[i].value );
				endX = begX;
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
					'class' : 'mark_x',
					'id' : null
				},
				scaleNodeCss = {
					'position' : 'absolute',
					'left':0,
					'top' : 0
				};
			
			for( var i=0,len=scaleInfo.length ; i<len ; i++ ) {
				
				item = scaleInfo[i];
				scaleNodeAttrs.id = 'mark_x_'+i;
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
		
			var nodeWidth = scaleNode.width(),
				x = scaleNode.css( 'left' ).replace( /px/ , '' ) - 0,
				scaleValueCss = {
					left : x-0.5*nodeWidth
				};
			
			if( this.scaleDirection==='down' ) {
				scaleValueCss.top = (-1)*scaleNode.height();
			}
			scaleNode.css( scaleValueCss );			
			return scaleNode;
		},
		//////////////////////////////////////////////////////////////////////
		'destroy' : function() {
			
			var topCon = this.getAxisContainer();
			
			$(topCon).empty().remove();
			this.bottomDis = null;
			this.leftDis = null;
			this.rightDis = null;
			this.leftScaleDis = null;
			this.rightScaleDis = null;
			this.data = null;
			this.$container = null;
			this.clearDynamicCache();
		},
		
		'reDraw' : function() {
			
			var topCon = $( this.getAxisContainer() );
			
			this.clearDynamicCache();
			topCon.empty();
			topCon.remove();
			this.draw();
		},
		
		'getAxisType' : function() {

			
			return this.TYPE;
		}
	} );
	//////////////////////////////////////////////////////////
	window.Axis_x = Axis_x;
	/////////////////////////////////////////////////////////
})();