const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://user_um25:4wppAUGuieaom0Qb@cluster0.mikrv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(client => {
      console.log('Connected');
      callback(client)
    })
    .catch(err => { console.log(err) });

}

module.exports = mongoConnect;
