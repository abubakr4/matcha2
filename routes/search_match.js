var express = require('express')
var router = express.Router()
var session = require('express-session')
var connection = require('../config/db');
var geo_tools = require('geolocation-utils');
const { NULL } = require('mysql/lib/protocol/constants/types');
var secretString = Math.floor((Math.random() * 10000) + 1);

router.get('/', (req, res) => {
    if (req.session.user && req.session) {
        var fill = 0;
        console.log("in get session is" + req.session.check)
        connection.query('SELECT * FROM user_filters WHERE username= ?', [req.session.user], (err1, rows1) => {
            if (err1) console.log(err1);
            else
            {
                console.log(rows1[0])
                var filter3 = "#" + rows1[0].Hobby
                req.session.filters = {
                    'filter1' : rows1[0].Age,
                    'filter2' : rows1[0].Orientation,
                    'filter3' : filter3
                }
                console.log(req.session.filters.filter1);
                console.log(req.session.filters.filter2);
                console.log(req.session.filters.filter3);
                var age_min;
                var age_max;
                var meters;
                var distance_array = [];
                var i = 0;


                if (rows1[0].Age == "None" && rows1[0].Orientation == "None" && rows1[0].Hobby == "None") {
                    connection.query("SELECT `users`.`username`, `users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`,`users`.`Latitude`, `users`.`Longitude`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ?", [req.session.user], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch users");
                        }
                        else {
                            
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                console.log(match_username)
                                console.log(latt)
                                console.log(longg)
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                console.log(distance_array[x]);
                                x++;
                            }
        
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
                else if (rows1[0].Age != "None" && rows1[0].Orientation == "None" && rows1[0].Hobby == "None") {
                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    
                    connection.query("SELECT `users`.`username`, `users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND `users`.`Age` >= ? AND `users`.`Age` <= ?", [req.session.user, age_min, age_max], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch users");
                        }
                        else {
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                console.log(match_username)
                                console.log(latt)
                                console.log(longg)
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                console.log(distance_array[x]);
                                x++;
                            }
                            
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }

                else if (rows1[0].Age == "None" && rows1[0].Orientation != "None" && rows1[0].Hobby == "None") {
                    connection.query("SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`Orientation` = ? AND `users`.`username` != ?", [req.session.filters.filter2, req.session.user], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch users");
                        }
                        else {
                            
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                console.log(match_username)
                                console.log(latt)
                                console.log(longg)
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                console.log(distance_array[x]);
                                x++;
                            }
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }

                else if (rows1[0].Hobby != "None" && rows1[0].Age == "None" && rows1[0].Orientation == "None") {
                    connection.query("SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?)", [req.session.user, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch users");
                        }
                        else {
                            console.log("Here is the match results " + users);
                            console.log(req.session.filters.filter3);
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                console.log(match_username)
                                console.log(latt)
                                console.log(longg)
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                console.log(distance_array[x]);
                                x++;
                            }
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }

                else if (rows1[0].Hobby != "None" && rows1[0].Age == "None" && rows1[0].Orientation != "None") {
                    connection.query("SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) AND `users`.`Orientation` = ?", [req.session.user, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter2], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch users");
                        }
                        else {
                            console.log("Here is the match results " + users);
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                console.log(match_username)
                                console.log(latt)
                                console.log(longg)
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                console.log(distance_array[x]);
                                x++;
                            }
                            console.log(req.session.filters.filter3);
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }

                else if (rows1[0].Hobby != "None" && rows1[0].Age != "None" && rows1[0].Orientation == "None") {
                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    connection.query("SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`username` != ? AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?) AND (`users`.`Age` >= ? AND `users`.`Age` <= ?)", [req.session.user, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, age_min, age_max], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch users");
                        }
                        else {
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                console.log(match_username)
                                console.log(latt)
                                console.log(longg)
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});;
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                console.log(distance_array[x]);
                                x++;
                            }
                            console.log("Here is the match results " + users);
                            console.log(req.session.filters.filter3);
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }

                else
                {
                    if (rows1[0].Age == "18-19") {
                        age_min = 18;
                        age_max = 19;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "20-25") {
                        age_min = 20;
                        age_max = 25;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "25-30") {
                        age_min = 25;
                        age_max = 30;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "30-35") {
                        age_min = 30;
                        age_max = 35;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "35-40") {
                        age_min = 35;
                        age_max = 40;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "40-45") {
                        age_min = 40;
                        age_max = 45;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "45-50") {
                        age_min = 45;
                        age_max = 50;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    if (rows1[0].Age == "50-older") {
                        age_min = 50;
                        age_max = 70;
                        console.log("Minimum age is: " + age_min + " Maximum age is: " + age_max);
                    }
                    connection.query("SELECT `users`.`username`,`users`.`Firstname`, `users`.`Lastname`, `users`.`Age`, `users`.`Orientation`, `users`.`Bio`, `users`.`profile_pic`, `user_hobbies`.`Hobby1`, `user_hobbies`.`Hobby2`, `user_hobbies`.`Hobby3`, `user_hobbies`.`Hobby4`, `user_hobbies`.`Hobby5` FROM `users` INNER JOIN `user_hobbies` ON `users`.`username` = `user_hobbies`.`username` WHERE `users`.`Orientation` = ? AND `users`.`username` != ? AND (`users`.`Age` >= ? AND `users`.`Age` <= ?) AND (`user_hobbies`.`Hobby1` = ? OR `user_hobbies`.`Hobby2` = ? OR `user_hobbies`.`Hobby3` = ? OR `user_hobbies`.`Hobby4` = ? OR `user_hobbies`.`Hobby5` = ?)", [req.session.filters.filter2, req.session.user, age_min, age_max, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3, req.session.filters.filter3], (err, users) => {
                        if (err) {
                            console.log(err);
                            console.log("Couldn't fetch users");
                        }
                        else {
                            var x = 0;
                            while (users[x]) {
                                let match_username = users[x].username;
                                let latt = users[x].Latitude;
                                let longg = users[x].Longitude;
                                let mylatt = req.session.Latitude;
                                let mylong = req.session.Longitude;
                                if (latt == undefined) {
                                    latt = 0;
                                }
                                if (longg == undefined) {
                                    longg = 0;
                                }
                                if (mylatt == undefined) {
                                    mylatt = 0;
                                }
                                if (mylong == undefined) {
                                    mylong = 0;
                                }
                                console.log(match_username)
                                console.log(latt)
                                console.log(longg)
                                var meters = geo_tools.distanceTo({lat: mylatt, lon: mylong}, {lat: latt, lon: longg});
                                var kilometers = meters / 1000;
                                distance_array[x] = kilometers;
                                console.log(distance_array[x]);
                                x++;
                            }
                            
                            var user_info = {
                                'username' : req.session.user,
                                'Email' : req.session.Email,
                                'Firstname' : req.session.Firstname,
                                'Lastname' : req.session.Lastname,
                                'profile_pic' : req.session.profile_pic,
                                'complete' : req.session.complete
                            }
                            var complete = 0;
                            if (req.session.complete) {
                                complete = 1;
                            }
                            res.render('search_match', {results: users, user : user_info, complete : complete, filters : req.session.filters, distance : distance_array});
                        }
                    })
                }
            }
        })
    }
    else {
        res.redirect('/login')
    }
})

router.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

router.post('/', (req, res) => {
    if (req.body.filter1 && req.body.filter2) {
        console.log("Entered loop");
        console.log(req.body.filter1);
        console.log(req.body.filter2);
        console.log(req.body.filter3);
        connection.query('UPDATE user_filters SET Age = ?, Orientation = ?, Hobby = ? WHERE username = ?', [req.body.filter1, req.body.filter2, req.body.filter3, req.session.user], (err) => {
            if (err) console.log(err)
            else {
                console.log("filters successfuly updated");
            }
        })
        res.redirect('/search_match');
    }
    else
    {
        console.log("could not fetch data");
        res.redirect('/search_match');
    }
})


module.exports = router