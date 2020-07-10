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
        connection.query('DELETE FROM connections WHERE username = ? AND connected_to = ?', [req.session.user, req.body.match_username], (err) => {
            if (err) console.log(err)
            else
            {
                console.log("Entered delete connection loop");
                console.log('deleted from connections');
                req.session.message = "User deleted from connections";
                connection.query('DELETE FROM connections WHERE username = ? AND connected_to = ?', [req.body.match_username, req.session.user], (err) => {
                    if (err) console.log(err)
                })
                res.redirect('/match_full_info');
            }
        })  
    }
    else
        res.redirect('/match_full_info')
})
module.exports = router;