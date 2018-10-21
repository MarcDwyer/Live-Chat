
const MongoClient = require('mongodb').MongoClient;
// const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000
const io = require('socket.io').listen(5000).sockets;

// app.use(bodyParser.json());
const mongo = process.env.MONGODB;



MongoClient.connect(mongo, (err, client) => {
    if (err) console.log(err);
    const db = client.db('abase');
    console.log('IS THIS RUNNING')

    io.on('connection', (socket) => {
        let chat = db.collection('chatter');

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

            if (!name || !message) sendStatus('Enter a name and message');

            chat.insert({name: name, message: message}, () => {
                io.emit('outputter', [data]);
                
                sendStatus({
                    message: 'Message Sent',
                    clear: true
                })
            })
        });
        socket.on('clear', (data) => {
            chat.remove({}, () => {
                socket.emit('cleared');
            })
        });
        socket.on('about', (data) => {
            socket.emit('news', {hello: world})
        })
    })

});