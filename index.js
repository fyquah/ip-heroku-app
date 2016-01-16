var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
const db_url = process.env.MONGO_DB_URL;
var db = null;

MongoClient.connect(db_url, function(err, db_in) {
	db = db_in;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); 

app.post("/", function(req, res) {
	db.collection('ips').insertOne({
		"ip": req.body.ip
	}, function(err){
		if (!err)
			res.send("Succeed");
	});
});

app.get("/", function(req, res) {
	var cursor = db.collection.find().limit(1).sort({"$natural":-1});
	cursor.each(function(err, doc) {
		if (doc && doc.ip) {
			res.send(doc.ip);
		} else {
			res.send("Failed");
		}
	});
});

app.listen(3000);
