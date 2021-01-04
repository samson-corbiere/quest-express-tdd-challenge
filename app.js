// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.Router());

app.get('/', (req, res) => {
    res.status(200).json({"message": "Hello World!"});
})
app.get('/bookmarks/:id', (req, res) => {
    console.log(req.params.id);
    db.query("SELECT * FROM bookmark WHERE id=?",[req.params.id], (err, results) => {
        if(err){
            res.sendStatus(500);
        }else{
            if(results.length === 0){
                res.status(404).json({ error: 'Bookmark not found' });
            }
            res.status(200).json(results[0]);
        }
    })
})
app.post('/bookmarks', (req, res) => {
    db.query("INSERT INTO bookmark SET ?", [req.body], (err, results) => {
        if(err){
            res.status(422).json({"error": "required field(s) missing"});
        }else{
            
            db.query("SELECT * FROM bookmark WHERE ?", [results.insertId], (err, results) => {
                if(err){
                    res.status(400).json({"error": "bookmark doesn't exists"})
                }
                res.status(201).json(results[0]);
            })
            
        }
    })
})

module.exports = app;