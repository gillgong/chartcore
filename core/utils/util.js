define(['jquery', 'underscore'], function($, _) {

    return {

    	/**
    	 *根据参数名称获取Url中的参数
    	 */
        p: function(n) {

            var url = window.location.href;
            var urlArr = url.split('?');
            var paramResult = {};
            var paramStr;

            if (urlArr.length > 2) {
                paramStr = urlArr[1];

                paramMapArr = paramStr.split('&');
                _.each(paramArr,function(v,i) {
                	_.extend(paramResult,this.strToJson(v,'='));
                });
            }

            return paramResult[n];
        },

        /**
         *将String转换为Json对象
         *
         * 'aa=bbb' to { aa:bb }
         */
        strToJson: function(str, tag) {
        	
        	var json = {};
        	var attr,val;

            if (_.isString(str) && _.isString(tag)) {

                var strArr = str.split(tag);
                
                for(var i=0,len=strArr.length;i<len;i++) {
                	attr = $.trim(strArr[i]);
                	val = $.trim(strArr[i+1]);
                	attr && (json[attr] = val);
                	++i;
                }
            }

            return json;
        }

    };
});
