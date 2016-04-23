'use strict';

var port = 3000;
var path = require('path');
var express = require('express');

var app = express();

app.set('port', port);
app.use(express.static(path.join(__dirname, 'core')));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, function() {
	 console.log('Express server listening on port ' + port);
});