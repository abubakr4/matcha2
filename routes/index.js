var express = require('express');
var router = express.Router();
var connection = require('../config/db')

/* GET home page. */
router.get('/', function(req, res) {
    if (req.session && req.session.user) { 
        connection.query("SELECT * FROM connections INNER JOIN `users` ON `connections`.`connected_to` = `users`.`username` WHERE `connections`.`username` = ? AND `connections`.`accepted` = 1", [req.session.user], (err, row) => {
            if (err)
                res.send("An error has occurred!");
            else
            {
                if (row[0]) {
                    connection.query('SELECT * FROM user_hobbies WHERE username = ?', [row[0].username], (err, conn_hobb) => {
                        if (err) console.log(err)
                        else
                        {
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'longitude' : req.session.Longitude,
                                'latitude' : req.session.Latitude,
                                'complete' : req.session.complete
                            }
                            connection.query('SELECT `user_hobbies`.`username`, `users`.`Age`, `users`.`profile_pic`,`user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `user_hobbies` INNER JOIN `users` ON `user_hobbies`.`username` = `users`.`username` WHERE `user_hobbies`.`username` = ?', [req.session.user], (err, row1) => {
                                if (err) console.log(err)
                                else
                                {
                                    if (row1[0])
                                    {
                                        console.log("the users info");
                                        console.log(user_info);
                                        console.log(row1[0].Hobby1)
                                        connection.query('SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) ORDER BY RAND() LIMIT 5', [req.session.user, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1], (err, result) => {
                                            if (err) console.log(err)
                                            else
                                            {
                                                if (result[0]) {
                                                    res.render('index', {title: 'Express', user : user_info, connections : row, suggestions : result, conn_hobb : conn_hobb});
                                                }
                                                else {
                                                    connection.query('SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND `users`.`City` = ? ORDER BY RAND() LIMIT 5', [req.session.user, req.session.city], (err, result1) => {
                                                        if (err) console.log(err)
                                                        else
                                                        {
                                                            console.log('entered other loop')
                                                            res.render('index', {title: 'Express', user : user_info, connections : row, suggestions : result1, conn_hobb : conn_hobb});
                                                        }
                                                    })
                                                }
                                            }
                                            
                                        })
                                    }
                                    else
                                        res.render('index', {title: 'Express', user : user_info, connections : row});
                                }
                            })
                        }
                    }) 
                }
                else
                {
                    var user_info = {
                        'username' : req.session.user,
                        'Email' : req.session.Email,
                        'Firstname' : req.session.Firstname,
                        'Lastname' : req.session.Lastname,
                        'profile_pic' : req.session.profile_pic,
                        'longitude' : req.session.Longitude,
                        'latitude' : req.session.Latitude,
                        'complete' : req.session.complete
                    }
                    connection.query('SELECT `user_hobbies`.`username`, `users`.`Age`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `user_hobbies` INNER JOIN `users` ON `user_hobbies`.`username` = `users`.`username` WHERE `user_hobbies`.`username` = ?', [req.session.user], (err, row1) => {
                        if (err) console.log(err)
                        else
                        {
                            if (row1[0])
                            {
                                
                                console.log("the users info");
                                console.log(user_info);
                                console.log(row1[0].Hobby1)
                                connection.query('SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`City` = ? AND `users`.`username` != ? ORDER BY RAND() LIMIT 5', [req.session.city, req.session.user], (err, result) => {
                                    if (err) console.log(err)
                                    else
                                    {
                                        if (result[0]) {
                                            res.render('index', {title: 'Express', user : user_info, suggestions : result, connections : "none"});
                                        }
                                        else {
                                            console.log(req.session.city);
                                            connection.query('SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`,  `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) ORDER BY RAND() LIMIT 5', [req.session.user, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1, row1[0].Hobby1], (err3, result2) => {
                                                if (err3) console.log(err)
                                                else
                                                {
                                                    console.log('entered other loop');
                                                    if (result2[0]) {
                                                        res.render('index', {title: 'Express', user : user_info, suggestions : result2, connections : "none"});
                                                    }
                                                    else
                                                    {
                                                        res.render('index', {title: 'Express', user : user_info, suggestions : "none", connections : "none"});
                                                    }
                                                }
                                            })
                                            
                                        }
                                        // res.render('index', {title: 'Express', user : user_info, connections : row});
                                    }
                                    
                                })
                            }
                        }
                    })
                }
                
                
            }
        })
    }
    else {
        res.redirect('/login')
    }
});

module.exports = router;
