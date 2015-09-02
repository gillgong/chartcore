(function(){
	/**
	*Axis Class is a super Class , any actual Class about axis 
	* are all should extend it. 
	*/
	var Axis = function( container , axisConf ) {
		this.$container = null;
		if( container ) {
			this.$container = $( container );
		}
		if( axisConf ) {
			this.axisWidth = axisConf.axisWidth==null? 5 : axisConf.axisWidth;
			this.requireScaleNum = axisConf.requireScaleNum || 5;
		}
		this.mapping = null;
		this.data = null;
		this.minValue = 0;
		this.maxValue = 0;
		this.axisContainer = null;
		this.svgConatiner = null;
		this.lineGroup = null;
		this.scaleGroup = null;
		this.axisLineInfo = null;
		this.scaleInfo = null;
		this.scaleDirection = null;
		this.init();
	};
	
	Axis.prototype = {
		
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
			
			this.data = this.processData( data );
		},
		
		'processData': function( data ) {
		
			this.setMaxAndMin( data );
			return data;
		},
		
		'setMaxAndMin' :  function( data ) {
			var mark = data.axisGuide[ this.getAxisType() ],
				axisData = data.data,
				min = 0,
				max = 0,
				item = null;
			
			if( axisData.length===0 ) return data;
			min = axisData[0][ mark ];
			max = axisData[0][ mark ];
			for( var len=axisData.length,i=0 ; i<len ; i++ ) {
			
				item = axisData[i];
				if( min>item[ mark ] ) {
					min = item[ mark ];
				}
				if( max<item[ mark ] ) {
					max = item[ mark ];
				}
			}
			if( min === max ) {
				min = min - 0.5;
				max = max + 0.5;
			}
			this.minValue = min;
			this.maxValue = max;
			return {
				'minValue' : min,
				'maxValue' : max
			};
		},
		
		'draw' : function( scaleNum ) {
			
			var requireScaleNum = scaleNum || this.requireScaleNum;
			
			this._render();
			////////do some thing before drawing axis/////////
			this.beforeDrawAxis();
			//////////////////////////////////////////////////
			this._drawAxisLine();
			this._drawScaleLine( requireScaleNum );
			this._drawScaleValue();
			////////do some thing after drawing axis//////////
			this.afterDrawAxis();
			//////////////////////////////////////////////////
		},
		
		'getAxisDom' : function() {
			
			return this.svgConatiner;
		},
		
		'getAxisContainer' : function() {
			
			return this.axisContainer;
		},
		
		//Some constant as below///////////////////////////
		'XMLNS' : 'http://www.w3.org/2000/svg',
		'SVG_NS' : "http://www.w3.org/2000/svg",
		///////////////////////////////////////////////////
		
		'init' : function() {},
		
		
		/**
		*Here is the axis html template as below:
		*	<div class="AxisContainer_x">
		*		<div class="svgContainer">
		*			<svg>
		*				<group class="lineGroup"></group>
		*				<group class="scaleGroup"></group>
		*			</svg>
		*		</div>
		*		<span class="mark_x" id="mark1"></span>
		*		<span class="mark_x" id="mark2"></span>
		*		<span class="mark_x" id="mark3"></span>
		*	</div>
		*
		*/
		'_render' : function() {
		
			var axisContainer = $('<div></div>').get(0),
				svgConatiner = $('<div></div>').get(0),
				svgCon = this._createSVGContainer(),
				lineGroup = this._createGroup(),
				scaleGroup = this._createGroup();
				
			this.axisContainer = axisContainer;
			this.svgConatiner = svgConatiner;
			this.lineGroup = lineGroup;
			this.scaleGroup = scaleGroup;
				
		    svgCon.appendChild( lineGroup );
			svgCon.appendChild( scaleGroup );
			svgConatiner.appendChild( svgCon );
			axisContainer.appendChild( svgConatiner );
			//////////add some class tag////////////////////////////
			svgConatiner.setAttribute( 'class' , 'svgContainer' );
			lineGroup.setAttribute( 'class' , 'lineGroup' );
			scaleGroup.setAttribute( 'class' , 'scaleGroup' );
			////////////////////////////////////////////////////////
			this._setAxisPosition();
			return this;
		},
		
		'_getNiceMinValue' : function( minValue ) {
			
			return Math.floor( minValue );
		},
		
		'_getNiceMaxValue' : function( maxValue ) {
			
			return Math.ceil( maxValue );
		},
		
		'_getScaleInfo' : function( scaleCount ) {
			
			if( this.scaleInfo===null ) {
				var niceMaxValue = this._getNiceMaxValue( this.maxValue ),
					niceMinValue = this._getNiceMinValue( this.minValue ),
					niceDis = niceMaxValue - niceMinValue,
					increaseCount = scaleCount,
					decreaseCount = scaleCount,
					increaseStep = 0,
					scaleInfo = [],
					isIncrease = true;
				
				while( niceDis % scaleCount !== 0 ) {
					if( isIncrease ) {
						scaleCount = (++increaseCount);
						isIncrease = false;
					}else{
						scaleCount = (--decreaseCount);
						isIncrease = true;
					}
				}
				increaseStep = (niceMaxValue - niceMinValue)/scaleCount;
				for( var i=0 ; i<=scaleCount ; i++ ) {
					scaleInfo.push( { 'value' : niceMinValue + i*increaseStep , 'x':0 , 'y':0 } );
				}
				this.scaleInfo = scaleInfo;
			}
			return this.scaleInfo;
		},

		'_createSVGContainer' : function() {
		
			var svgTemplate = document.createElementNS( this.SVG_NS , 'svg' );
			
			svgTemplate.setAttribute( 'xmlns' , this.XMLNS );
			svgTemplate.setAttribute( 'version' , '1.1' );
			svgTemplate.setAttribute( 'overflow' , 'hidden' );
			svgTemplate.setAttribute( 'width' , '100%' );
			svgTemplate.setAttribute( 'height' , '100%' );
			return svgTemplate;
		},
		
		'_createGroup' : function() {
		
			return document.createElementNS( this.SVG_NS , 'g' );
		},
		
		'clearDynamicCache' : function() {
			
			this.mapping = null;
			this.minValue = 0;
			this.maxValue = 0;
			this.axisContainer = null;
			this.svgConatiner = null;
			this.lineGroup = null;
			this.scaleGroup = null;
			this.axisLineInfo = null;
			this.scaleInfo = null;
		},
		
		'_createScaleNode' : function( scaleNodeAttrs , scaleNodeCss , value ) {
			
			var scaleNode = $('<span></span>'),
				axisContainer = this.getAxisContainer();
			
			scaleNode.attr( scaleNodeAttrs );
			scaleNode.css( scaleNodeCss );
			scaleNode.text( value );
			axisContainer.appendChild( scaleNode[0] );
			return scaleNode;
		},
		
		'_drawScaleValue' : function() {},
		'_drawAxisLine' : function() {},
		'_drawScaleLine' : function() {},
		'_setAxisPosition' : function() {},
		'getScaleDoms' : function() {},
		'beforeDrawAxis' : function() {},
		'getAxisLineInfo' : function() {},
		'afterDrawAxis' : function() {},
		'scaleNodeNiceFix' : function() {},
		'getAxisType' : function() {},
		'getCoorFromValue' : function() {},
		'getValueFromCoor' : function() {},
		'destroy' : function() {},
		'reDraw' : function() {}
	};
	
	Axis.prototype.constructor = Axis;
	window.Axis = Axis;
})();