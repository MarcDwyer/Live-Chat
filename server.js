const express = require('express');
const app = express();
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const server = require('http').createServer(app)
const port = process.env.PORT || 3000
const io = require('socket.io').listen(server).sockets;


const mongo = process.env.MONGODB;
server.listen(port);
app.use('/', express.static('./public'));
// app.listen(port)

let connected = [];

MongoClient.connect(mongo, (err, client) => {
    if (err) console.log(err);
    const db = client.db('abase');
    console.log('IS THIS RUNNING')

    io.on('connection', (socket) => {
        let chat = db.collection('chatter');

        connected.push(socket);
       
        io.emit('counter', connected.length);

        sendStatus = function(s) {
            socket.emit('status', s)
        }

        chat.find({}).limit(100).toArray((err, res) => {
            if (err) {
                console.log(err);
            }
            socket.emit('output', res);
        });

        socket.on('input', (data) => {
            let name = data.name;
            let message = data.message;
           
            if (name.length == 0|| message.length == 0) {
                sendStatus('Please enter a name and message');
                return;
            }

            chat.insertOne({name: name, message: message}, () => {
                io.emit('output', [data]);
                
                sendStatus({
                    message: 'Message Sent',
                    clear: true
                })
            })
        });
        socket.on('clear', () => {
            chat.remove({}, () => {
                socket.emit('cleared');
            })
        });
        socket.on('about', (data) => {
            socket.emit('news', {hello: world})
        })
        socket.on('disconnect', (socket) => {
          const ind = connected.indexOf(socket);
            connected.splice(ind, 1);
            io.emit('counter', connected.length);
        })
    })
});