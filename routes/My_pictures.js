const express = require('express');
var session = require('express-session');
var router = express.Router();
var connection = require('../config/db');
var bodyParser = require('body-parser');
var multer = require('multer');
var Objects = require('../objects');
var uploads = multer({dest: "Uploads"});
var secretString = Math.floor((Math.random() * 10000) + 1);

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.get('/', (req, res) => {
    if (req.session.user)
    {
        var user_info = {
            'username' : req.session.user,
            'Email' : req.session.Email,
            'Firstname' : req.session.Firstname,
            'Lastname' : req.session.Lastname,
            'profile_pic' : req.session.profile_pic,
            'complete' : req.session.complete
            }
        connection.query("SELECT * FROM images WHERE username = ?", [req.session.user], (err, images) => {
            if (err)
                res.send("An error has occurred!");
            else
            {
                console.log(images);
                let image_upload_limit = 5;
                image_upload_limit -= images.length;
                var complete = 0;
                if (req.session.complete) {
                    complete = 1;
                }
    
                res.render('My_pictures', {image_upload_limit: image_upload_limit, uploaded_images: "",amount: "", images: images, user : user_info, complete : complete});
            }
        })
    }
    else
        res.redirect('/login');
})


router.post('/', (req, res) => {
    console.log("entered array");
    var set = req.body.image;
    var username = req.session.username;
    console.log("here is the upload data" +set);
    connection.query("UPDATE users SET profile_pic = ? WHERE username = ?", [set, username], (err, succ) => {
        if (err)
            res.send("An error has occured");
        else
        {
            req.session.success = "profile_pic updated";
            req.session.profile_pic = set;
            res.redirect('/My_pictures');
        }
    });
});


router.post('/change_profile_pic', (req, res) => {
    if (req.session.user)
    {
        console.log("entered loop");
        if (req.body.set_this_pic)
        {
            connection.query("UPDATE users SET profile_pic = ? WHERE username = ?", [req.body.set_this_pic, req.session.user], (err, succ) => {
                if (err)
                    res.send("An error has occured!");
                else
                {
                    req.session.profile_pic = req.body.set_this_pic;
                    res.redirect('/My_pictures');
                }
            })
        }
    }
    else
        res.redirect('/login');
})

module.exports = router
