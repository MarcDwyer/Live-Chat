const ObjectId = require('mongodb').ObjectID;

module.exports = function(app, db) {

    app.get('/api/comments', (req, res) => {
        db.collection('chat').find({}).toArray((err, result) => {
            if (err) {
                res.send({'error': 'error has occured'})
            } else {
                res.send(result)
        }
})
})

app.post('/api/post', (req, res) => {
    //console.log('asdadsafafasfa');
   console.log(req.body);
 //  const obj = comment: {name: req.body.name, message: req.body.message};
     db.collection('chat').insertOne(req.body, (err, result) => {
        if (err) {
            res.send({'error': 'error has occured'});
        } else {
            res.send('Comment Posted');
    }
})
})
}