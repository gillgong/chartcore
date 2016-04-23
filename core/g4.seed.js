/**
 *暴露框架名称/常用方法
 *
 *@author Gill gillmstar@163.com
 */
(function() {

    var p = function(n) {

        var url = window.location.href;
        var urlArr = url.split('?');
        var paramResult = {};
        var paramStr;

        if (urlArr.length > 1) {
            paramStr = urlArr.pop();
            paramMapArr = paramStr.split('&');
            _.each(paramMapArr, function(v, i) {
                _.extend(paramResult, strToJson(v, '='));
            });
        }

        return paramResult[n];
    };

    /**
     *将String转换为Json对象
     *
     * 'aa=bbb' to { aa:bb }
     */
    var strToJson = function(str, tag) {

        var json = {};
        var attr, val;

        if (_.isString(str) && _.isString(tag)) {

            var strArr = str.split(tag);

            for (var i = 0, len = strArr.length; i < len; i++) {
                attr = $.trim(strArr[i]);
                val = $.trim(strArr[i + 1]);
                attr && (json[attr] = val);
                ++i;
            }
        }
        return json;
    };

    window.g4 = {
    	version:'16.01.01',
    	p:p
    };
    window.G4 = window.g4;
})();
