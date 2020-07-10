const connection = require('../config/db');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    if (!req.session && !req.session.user)
        res.redirect('/login');
    else{
        const user = req.session.user;
        var query = "SELECT * FROM connections WHERE username = ? AND accepted = 1";
        connection.query(query, [user], (err, row) => {
            if (err){
                console.log("database error");
                res.status(400).send("database error");
            }else{
                if (!row){
                    console.log("somthing went wrong");
                    res.status(200).send({msg: "empty"});
                }else{
                    var iter = (row) => {
                        var i = 0;
                        while (row[i])
                             i++;
                        return i;
                    }
                    var num = iter(row);
                    res.render('chats', {no: num, contact: row});
                }
            }
        })
    }
});

module.exports = router
