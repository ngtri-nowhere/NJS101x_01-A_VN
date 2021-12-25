const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://user_um25:4wppAUGuieaom0Qb@cluster0.mikrv.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
      console.log('Connected');
      _db = client.db() // luu mot ket noi voi database
      callback(client)
    })
    .catch(err => {
      console.log(err);
      throw err;

    });
}

const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'No Database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
