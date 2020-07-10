var connection = require('../config/db');
//var bodyParser = require('body-parser');
//var multer = require('multer');
//var Objects = require('../objects');
//var uploads = multer({dest: "Uploads"});
const express = require('express');
var session = require('express-session');
var router = express.Router();
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.get('/', (req, res) => {
    if (!req.session && !req.session.user)
        res.redirect('/login');
    else
        res.render('messages', {msg: "i wonder why"});
});

router.post('/', (req, res) => {
    if (!req.session && !req.session.user)
        res.redirect('/login');
    else{
        const to = req.session.user;
        const from = req.body.username;
        var query = "SELECT * FROM messages WHERE sentby = ? AND sentto = ?";
        connection.query(query, [from, to], (err, row) => {
            if (err){
                console.log("database error");
                res.status(400).send("database error");
            }else if (!row){
                res.render('messages', {msgs: "empty"}); 
            }else{
                var iter = (row) => {
                    var i = 0;
                    while (row[i])
                         i++;
                    return i;
                }
                var num = iter(row);
                res.render('messages', {no: num, message: row});
                //res.status(200).send(row);
            }
        });
    }
})

module.exports = router
