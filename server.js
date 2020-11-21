const app = require('index');

// set our port
var port = process.env.PORT || 8080;
app.listen(port);

console.log('EasyMusic on port ' + port);