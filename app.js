
var express = require('express'),
	path = require('path'),
	port = 3000,
	app;

app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set( 'title','my node web test');
app.get('/get',function( req , res , next ) {
	
	res.send("very good");
	res.end();
});
app.listen( port );
console.log( 'app path is :'+ app.path() );
console.log('Express server listening on port 3000');
module.exports = app;
