const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var util = require('util');
// Connection URL
const url = 'mongodb://localhost:27017';
let usercollection;
let mapcollection;
// Database Name
const dbName = 'udg';
let db;
// Create a new MongoClient
const client = new MongoClient(url, {useNewUrlParser: true});



// Use connect method to connect to the Server
exports.connect =  function(){client.connect(function(err,callback) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db = client.db(dbName);
  //console.log(db)
  usercollection = db.collection('user');
  mapcollection = db.collection('udgmap');
  //console.log(usercollection)
  //console.log(mapcollection)
  //여기서 테스트를 원하는 function 호출
  
});
}



//1. signin.do : find user by id, pw for login
exports.signin = function(id,pw, callback) {
  // get user collection 
  console.log("try to found user");
  // find user by id, pw
  usercollection.find({$and : [{id : id}, {pw: pw}]}).toArray(function(err, userinfo) {
      assert.equal(err, null);
      console.log("found user :");
      console.log(userinfo); //dcenter : [Array]
      // return the result
      callback(userinfo); 
  });
}

//2. signup.do : insert new user info when signing up
exports.signup = function(id, pw, email, callback){
  //get user collection
  //insert new userinfo
  usercollection.insertOne({id:id, pw:pw, email:email}).then(function(err,result){
    //assert.equal(err,null);
    //assert.equal(1,results.result.n);
    //assert.equal(1,results.ops.length);
    console.log('Inserted the new user')
    callback(result);
  });
}

//3. makemap.do : 
//3-1 :make a new map in udgmap collection
const addmap_udg = function(db,id,dname,x,y,o, callback){
  //get udgmap collection
  //insert a new map
  mapcollection.insertOne({id:id, dname:dname, dcenter:[x,y], onlyme:o, cnt_follow:0, markers:[]}, function(err,result){
    console.log('inserted mymap in udgmap');
    callback(result);
  });
}
//3-2: add a map in user document in user collection
const addmap_user = function(db,id,dname,x,y, callback){
  //get user collection
  //add a new map
  usercollection.updateOne({id:id}
    ,{ $set: {'mymap.creator': id, 'mymap.dname': dname, 'mymap.dcenter': [x,y] } }, function(err,result){
    console.log('added a map in user mymap');
    callback(result);
  });
}

// 4. savemap.do : save new markers on an existing map
const addmarkers = function(db,id,dname,x,y,markers, callback){
  //get udgmap collection
  //for forEach
  var mks = markers['mks']; 
  //object{"title" : "1","lat" : 37.484781,"lng" : 127.0162, "desc" : {"con" : "no.1"}}
  //markers 원형은 아래 참고 
  mks.forEach(function(items,index){
    mapcollection.updateOne({id:id, dname:dname,dcenter:[x,y]}
      ,{ $push: {markers: {title: items.title
      , lat:items.lat, lng:items.lng
      , desc : {content:items.desc.con}}}}, function(err,result){
      assert.equal(1, result.result.n);
      console.log('added a marker in the map');
    });
  });
}

/*
var markers ={"c_id" : "aa", "center":{lat: 37.484780, lng: 127.016129} 
        , "mapname" : "안녕" 
        , "mks" : [{"title" : "1","lat" : 37.484781,"lng" : 127.0162, "desc" : {"con" : "no.1"} }
        ,{"title" : "2","lat" : 37.484800,"lng" : 127.0163, "desc" : {"con" : "no.2"} }
        ,{"title" : "3","lat" : 37.484789,"lng" : 127.0164, "desc" : {"con" : "no.3"} }]};
*/

//5. sharemap.do : set a map shared 
const shared = function(db,id,dname,x,y, callback){
  //get user collection
  //set the map shared
  mapcollection.updateOne({id:id, dname: dname, dcenter:[x,y]}, {$set: {onlyme:0}}, function(err, result){
    assert.equal(1,result.result.n);
    console.log('the map is shared now');
    callback(result);
  });
}



//6. followmap.do : add a map to the user's follow field
//6-1: user collection update
const followmap_add = function(db,id,c_id, dname, x,y, callback){
  //get user collection
  //update user document
  usercollection.updateOne({id:id}
    ,{$set:{'follow.creator':c_id, 'follow.dname':dname, 'follow.dcenter':[x,y]}}, function(err,result){
    console.log('added a map in user followmap');
  });
}

//6-2: udgmap collection update - cnt_follow +1
const followcnt_inc = function(db,id, dname, x,y, callback){
  //get udgmap collection
  //cnt_follow +1
  mapcollection.updateOne({id:id, dname: dname, dcenter:[x,y]},{$inc:{cnt_follow:1}}, function(err,result){
    console.log('increased cnt_follow by 1');
  });
}


//7. searchmap.do : find shared maps of certain location, sorted by cnt_follow
const searchmaps = function(db,x,y, callback) {
  // get udgmap collection 
  // find shared maps at the point of [x,y]
  mapcollection.find({$and :[{dcenter:[x,y]},{onlyme: 0}]}).sort({cnt_follow: -1}).toArray(function(err, foundmaps) {
      assert.equal(err, null);
      console.log("found maps :");
      //console.log(foundmaps); // markers: [ [Object], [Object] ]
      console.log(util.inspect(foundmaps,{depth:5}));
      // return the result
      callback(foundmaps); 
  });
}

//8. mainpage.go : find all maps that is shared
const allmaps = function(db, callback) {
  // get udgmap collection 
  // find maps whose 'onlyme' field is 0
  mapcollection.find({onlyme: 0}).toArray(function(err, allmaps) {
      assert.equal(err, null);
      console.log("all maps :");
      //console.log(allmaps);
      //console.log('%j', allmaps);
      console.log(util.inspect(allmaps,{depth:5}));
      // return the result
      callback(allmaps); 
  });
}

//9. mymap.go : find my maps by id
const mymaps = function(db,id, callback) {
  // get udgmap collection 
  // find my maps by id
  mapcollection.find({id: id},{mymap:1}).toArray(function(err, mymaps) {
      assert.equal(err, null);
      console.log("mymaps :");
      //console.log(mymaps);
      console.log(util.inspect(mymaps,{depth:5}));
      // return the result
      callback(mymaps); 
  });
}


//10. myfollowmap.go : find my following maps by id
const followmaps = function(db, id, callback) {
  // get user collection 
  // find following maps by id
  var ft = { followmap: 1}
  usercollection.find({id: id}, {projection:ft}).toArray(function(err, followmaps) {
      assert.equal(err, null);
      console.log("followmaps :");
      //console.log(followmaps);
      console.log(util.inspect(followmaps,{depth:5}));
      // return the result
      callback(followmaps); 
  });
}






