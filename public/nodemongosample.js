const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27777';

mongo.connect(url, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    const db = client.db('news');

    const collection = db.collection('news_main');

    collection.find().toArray((err, items) => {
        console.log(items)
    })
});

