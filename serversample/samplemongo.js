var mong = require('./mongo_query_testdone');

mong.connect(function(){
    mong.signup("aa","aa","aa",function(err,data){
        if(err){
            console.log(err);
        }
        console.log(data)
    });
    mong.signin("aa","bb",function(data){
        console.log(data)
    });
});
