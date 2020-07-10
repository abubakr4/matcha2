var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var session = require('express-session')
var nodemailer = require('nodemailer')
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));


router.post('/', (req, res) => {
    if (req.body.match_username) {
        connection.query('INSERT INTO connections  (`username`, `connected_to`) VALUES (?, ?)', [req.session.user, req.body.match_username], (err) => {
            if (err) console.log(err)
            else
            {
                console.log("Entered add connection loop");
                console.log('Inserted into connections');
                req.session.message = "User added to connections";
                
                res.redirect('/match_full_info');
            }
        })  
    }
    else
        res.redirect('/match_full_info')
})
module.exports = router;