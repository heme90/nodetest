var http = require('http');
var fs = require('fs');
http.createServer(function(req,res){
    var _url = req.url;
    req.method = req.method.toUpperCase();
    console.log(_url)
    //console.log("hi im node")
    if (req.method !== 'GET') {
         res.writeHead(501,{
             'Content-Type' : 'text/plain'
         });
         return res.end('<h1>no</h1>');
    }
    
    if (_url = '/' ) {

        res.end(fs.readFileSync('C:\\MyNode\\nodetest\\index.html','utf-8'))
    
    }
    
    if (_url = '/comment' ) {
       
        res.write('<h1>지도 주석 페이지의 html입니다</h1><br/>');
    
    } 
    
    if (_url = '/comment.do' ) {
        
        res.write('<h1>지도 주석 페이지의 실행 스크립트입니다</h1><br/>'
        + req['comm']+ ' 을 주석으로 등록합니다');
    
    }
    
    if (_url = '/share.do' ) {
        
        res.write('<h1>지도 공유 페이지의 실행 스크립트입니다</h1><br/>'
        + req['user'] + ' 의 ' + req['mapnum'] + ' 번 지도를 공유합니다');
    
    }
    
    if (_url = '/follow.do' ) {
      
        res.write('<h1>지도 팔로우 페이지의 실행 스크립트 입니다</h1><br/>'
        + req['globalmapnum'] + ' 번 지도를 팔로우합니다');
    
    }

}).listen(1337,'localhost');