
var express = require('express');

// instantiate express
const app = express();

// set our port
var port = process.env.PORT || 8080;

// get an instance of the express Router
var router = express.Router();

// test route to make sure everything is working
router.get('/test', function (req, res) {
    res.json({ message: 'API is working correctly!' });
});

var artists = [{name:"gianni",email:"gitd@com.it",bio:"cioa"},
                {name:"piero pelù",email:"assodicoppe@com.it",bio:"miciomiao"}];

router.route('/artists')
        .get(function (req, res) {
                res.json(artists);
});

router.route('/artists/:artist-name')
    .get(function(req,res){
        var name = req.params.name;
        console.log(artists[name]);
            res.json(artists[name]);
    });

//####################################### SET ROUTER #################
// register our router on /
app.use('/', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});

//####################################################################

app.listen(port);
console.log('EasyMusic on port ' + port);
