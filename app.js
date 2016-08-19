var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var path = require('path')
/* GET home page. */
app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.urlencoded({ extended: false })); 


/* start http server */
var server = app.listen(6888, function(req, res) {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});

require('./routes/crawler')(app)
require('./routes/login')(app)
require('./routes/regist')(app)