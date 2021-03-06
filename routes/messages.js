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
        connection.query(query, [from, to], (err, them) => {
            if (err){
                console.log("database error");
                res.status(400).send("database error");
            }else{
                query = "SELECT * FROM messages WHERE sentby = ? AND sentto = ?";
                connection.query(query, [to, from], (err, me) => {
                    if (err){
                        console.log("database error");
                        res.status(400).send("database error");
                    }else{
                        var iter = (row) => {
                            var i = 0;
                            while (row[i])
                                 i++;
                            return i;
                        }
                        var themNum = iter(them);
                        var meNum = iter(me);
                        res.render('messages', { meName: to ,themName: from,themNum: themNum, meNum: meNum, themMsg: them, meMsg : me });
                    }
                });
            }
        });
    }
})

module.exports = router
