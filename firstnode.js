var http = require('http');
http.createServer(function(req,res){
    var _url;
    req.method = req.method.toUpperCase();
    console.log("hi im node")
    res.end("<h1>can do this?</h1>")
}).listen(1337,'localhost');