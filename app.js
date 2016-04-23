'use strict';

var app,
	port = 3000,
	path = require('path'),
	express = require('express');

app = express();
app.set('port', port);
app.use(express.static(path.join(__dirname, 'public')));

///////////////////////////////////APIS///////////////////////////////////////////////////////
app.use('/get/dashboardhead',function(req, res, next) {
	var data = {
			'pageAccess' : 8000,
			'userAccess' : 5000,
			'newUserNum' : 2000,
			'bookingNum' : 1000
	};
  	res.end( JSON.stringify( data ) ,'utf-8');
});
//////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, function() {
	console.log('Express server listening on port ' + port);
});