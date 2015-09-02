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
	*			requireScaleNum : xxx,
	*			timeType : xxx
	*		}
	*/
	
	var Axis_time_x = function( container , axisConf ) {
	
		Axis_x.call(this,container,axisConf);
		this.timeType = axisConf.timeType || 'YYYY/MM/DD';
	};
	
	Axis_time_x.prototype = new Axis_x();
	
	$.extend( Axis_time_x.prototype , {
	
		'AXISCLASS' : 'axisContainer_time_x',
		
		'TYPE' : 'x',
		
		/**
		*Override this method , make it to adapt for time. 
		*/
		
		'setMaxAndMin' : function( data ) {
			
			var mark = data.axisGuide[ this.getAxisType() ],
				axisData = data.data,
				min = 0,
				max = 0,
				item = null;
			
			if( axisData.length===0 ) return data;
			min = this.getMilliseconds( axisData[0][ mark ] );
			max = min;
			for( var len=axisData.length,i=0 ; i<len ; i++ ) {
			
				item = this.getMilliseconds( axisData[i][ mark ] );
				if( min>item ) {
					min = item;
				}
				if( max<item ) {
					max = item;
				}
			}
			this.minValue = min;
			this.maxValue = max;
			return {
				'minValue' : min,
				'maxValue' : max
			};
		},
	
		'getMilliseconds' : function( parsedDate ) {
		
			var parsedDate = this.parseDateForString( parsedDate );
		
			return Date.UTC( parsedDate.year , parsedDate.month , parsedDate.day );
		},
		
		/**
		*If you want to use Time Axis , you should implements this method,
		*this result as below:{
		*	'year' : xxx,
		*	'month' : xxx,
		*	'day' : xxx
		*}
		*/
		'parseDateForString' : function( dateStr ) {
			var dateInfo = null,
				format = this.timeType,
				dateConf = { "year" : 0, "month" : 0 , "day" : 0 };
			
			if( dateStr == null ) return null;
			dateInfo = dateStr.split( "/" );
			dateConf.year = dateInfo[0];
			dateConf.month = dateInfo[1];
			dateConf.day = dateInfo[2];
			return dateConf;
		},
		
		'_getNiceMinValue' : function( minValue ) {
			
			return minValue;
		},
		
		'_getNiceMaxValue' : function( maxValue ) {
			
			return maxValue;
		},
		
		'displayValue' : function( item ) {
			
			var dateObj = new Date( item.value ),
				year = dateObj.getFullYear(),
				month = dateObj.getMonth(),
				date = dateObj.getDate();
				
			return year + '/' + (month =='0' ? 12 : month) + '/' +date;
		}
	} );
	Axis_time_x.prototype.constructor = Axis_time_x;
	window.Axis_time_x = Axis_time_x;
})();