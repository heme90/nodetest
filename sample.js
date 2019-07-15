var http = require('http'); // Import Node.js core module
var fs = require('fs');
var server = http.createServer(function (req, res) {   //create web server
    
    
    if (req.url == '/') { //check the URL of the current request
        
        // set response header
        res.writeHead(200, { 'Content-Type': 'text/html' }); 
        // set response content    
        res.write(fs.readFileSync('C:\\MyNode\\nodetest\\index.html','utf-8'));
        res.end();
    
    }
    else if (req.url == "/comment") {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><h1>지도 주석 페이지의 html입니다</h1><br/></html>','utf-8');
        res.end();
    
    }else if (_url = '/comment.do' ) {
        
        res.write('<h1>지도 주석 페이지의 실행 스크립트입니다</h1><br/>'
        + req['comm']+ ' 을 주석으로 등록합니다','utf-8');
    
    }
    else{
        res.end('Invalid Request!');
    }
});

/*

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
*/


server.listen(1337,'localhost'); //6 - listen for any incoming requests

console.log('Node.js web server at port 1337 is running..')