var express = require("express");
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
const db_url = process.env.MONGOLAB_URI;
var db = null;

MongoClient.connect(db_url, function(err, db_in) {
	db = db_in;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); 

app.post("/", function(req, res) {
    var collection = db.collection("ips")
    collection.findOne({}, {"sort": [["date", "desc"]]}, function(err, doc){
        if(err) return;
        console.log(doc)
        var new_entry = {
            "ip": req.body.ip,
            "date": new Date(),
        }
        if (doc) {
            console.log(doc)
            collection.updateOne(
                { "_id": doc._id },
                { $set: new_entry },
                function(err){
                    if (!err) res.send("Succeed");
                    else res.send("Failed!")
                }
            );
        } else {
            collection.insertOne(
                new_entry,
                function(err){
                    if (!err) res.send("Succeed");
                    else res.send("Failed!")
                }
            );
        }
    })
});

app.get("/", function(req, res) {
    console.log("Request GET")
    var collection = db.collection("ips")
    cursor = collection.findOne({}, {"sort": [["date", "desc"]]}, function(err, doc){
        if (doc && doc.ip) {
            res.send(doc.ip);
        } else {
            res.send("no ip in store");
        }
    })
});

app.listen(process.env.PORT || 3000);
