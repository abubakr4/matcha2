var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var session = require('express-session')
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));


router.post('/', (req, res) => {
    if (req.body.match_username) {
        connection.query('UPDATE connections SET accepted = 1 WHERE username = ? AND connected_to = ?', [req.body.match_username, req.session.user], (err) => {
            if (err) console.log(err)
            else
            {
                console.log("Entered accept connection loop");
                console.log('Updated connections');
                req.session.message = "Connection succesfuly accepted";
                connection.query('INSERT INTO connections  (`username`, `connected_to`, `accepted`) VALUES (?, ?, 1)', [req.session.user, req.body.match_username], (err1) => {
                    if (err1) console.log(err1)
                    else
                    {
                        console.log("Entered add connection loop");
                        console.log('Inserted into connections');
                        req.session.message = "User added to connections";
                        
                        res.redirect('/connection_requests');
                    }
                })  
            }
        })  
    }
    else
        res.redirect('/connection_requests')
})
module.exports = router;