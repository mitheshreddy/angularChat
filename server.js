"use strict";
var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

var { ObjectId } = require('mongodb');

const MongoClient = require('mongodb').MongoClient,
    url = "mongodb://localhost:27017/";

const avatars = ['female-avatar-1', 'female-avatar-2', 'female-avatar-3', 'female-avatar-4', 'male-avatar-1', 'male-avatar-2', 'male-avatar-3', 'male-avatar-4'];

var users = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//The dist folder has our static resources (index.html, css, images)
app.use(express.static(__dirname + '/dist'));

//------------------------------------------------------------------------------------------------------------------------
// redirect all others to the index (HTML5 history)

app.post('/api/users', (req, res) => {
    console.log(req.body);
    insertUser(req.body, res);
});

app.get('/api/users', (req, res) => {
    findAllUsers(res);
});

app.get('/api/messages/', (req, res) => {
    console.log(req.query);
    getMessages(req.query, res);
});

function findAllUsers(res) {
    MongoClient.connect(url, (err, db) => {
        let dbo = db.db("chatDB");

        dbo.collection("users").find({}).toArray((err, result) => {
            //console.log(result);
            res.json(result);
            db.close();
        });
    });
}

function insertUser(obj, resp) {
    MongoClient.connect(url, (err, db) => {
        let userObj = { name: obj.name, availableInd: true, avatarSrc: avatars[Math.floor(Math.random() * 8)] };
        let dbo = db.db("chatDB");
        let query = { 'name': obj.name };
        dbo.collection('users').findOne(query, (err, result) => {
            if (result == null) {
                dbo.collection("users").insertOne(userObj, (err, res) => {
                    console.log(res.insertedId);
                    resp.send(res.insertedId);
                    db.close();
                });
            }
            else {
                console.log(result);
                resp.send(result._id);
                db.close();
            }
        });

    });
}

function getMessages(obj, resp) {
    MongoClient.connect(url, (err, db) => {
        let dbo = db.db("chatDB");
        let query = {
            $or: [{
                'author_id': obj.id1,
                'reciever_id': obj.id2
            },
            {
                'author_id': obj.id2,
                'reciever_id': obj.id1
            }]
        };
        let sort = { 'sentAt': 1 };
        dbo.collection("messages").find(query).sort(sort).toArray((err, result) => {
            console.log(result);
            resp.json(result);
            db.close();
        });
    });
}

io.on('connection', function (socket) {
    let _id;
    let messagesArray = [];

    socket.on('online', (user) => {
        try {
            console.log("connect");

            _id = user._id;
            users[_id] = socket.id;
            console.log(users);
            MongoClient.connect(url, (err, db) => {
                let dbo = db.db("chatDB");
                var newvalues = { $set: { "availableInd": true } };
                dbo.collection("users").updateOne({ '_id': ObjectId(user._id) }, newvalues, function (err, res) {
                    db.close();
                });
            });

            socket.broadcast.emit('onlineUsers', user);

        }
        catch (e) {
            console.log(e);
        }


    });

    socket.on('disconnect', function () {
        console.log(_id);
        console.log('disconnected');

        if (_id != undefined) {
            try {
                socket.broadcast.emit('disconnectedUsers', _id);
                MongoClient.connect(url, (err, db) => {
                    let dbo = db.db("chatDB");
                    var newvalues = { $set: { "availableInd": false } };
                    dbo.collection("users").updateOne({ '_id': ObjectId(_id) }, newvalues, function (err, res) {
                        db.close();
                    });
                });


            }
            catch (e) {
                console.log(e);
            }
        }
    });

    socket.on('message', function (message) {
        console.log("message");
        //console.log(message);
        let socketId = users[message.receiver._id];
        console.log(socketId);
        let isRead = false;
        if (socketId) {
            console.log("see ya");
            socket.broadcast.to(socketId).emit('incomingMessage', message);
            //io.to(socketId).emit('incomingMessage', message);
            isRead = true;
        }

        MongoClient.connect(url, (err, db) => {
            let dbo = db.db("chatDB");
            let messageObj = {
                'sentAt': message.sentAt,
                'isRead': isRead,
                'author_id': message.author._id,
                'reciever_id': message.receiver._id,
                'text': message.text
            };
            dbo.collection("messages").insertOne(messageObj, (err, res) => {
                db.close();
            });
        });
    });

});;

app.all('/*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

server.listen(3000);

console.log('Express listening on port 3000.');

//Open browser
/*var opn = require('opn');

opn('http://localhost:3000').then(() => {
    console.log('Browser closed.');
});*/


