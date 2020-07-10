// const connection = require('./config/db');
// const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const path = require('path');
const http = require('http');

const port = 3000 || process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socket(server);

const secretString = Math.floor((Math.random() * 10000) + 1);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: 'true'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: secretString.toString(),
    resave: false,
    saveUninitialized: false
}));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const forgotRouter = require('./routes/forgot');
const verifyRouter = require('./routes/Verify_email');
const resetRouter = require('./routes/reset');
const logoutRouter = require('./routes/logout');
const settingsRouter = require('./routes/settings');
const searchMatchRouter = require('./routes/search_match');
const myPicturesRouter = require('./routes/My_pictures');
const fullProfile = require('./routes/match_full_info');
const addLike = require('./routes/add_like');
const deleteLike = require('./routes/delete_like');
const addConnection = require('./routes/add_connection');
const deleteConnection = require('./routes/delete_connection');
const acceptConnection = require('./routes/accept_connection');
const declineConnection = require('./routes/decline_connection');
const connectionRequests = require('./routes/connection_requests');
const uploadImages = require('./routes/upload_images');
const removeImage = require('./routes/remove_image');
const chats = require('./routes/chats');
const messages = require('./routes/messages');

app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/home/Uploads', express.static(path.join(__dirname, '/home/Uploads')));
app.use('/search/Uploads', express.static(path.join(__dirname, '/search/Uploads')));
app.use('/index_images', express.static(path.join(__dirname, 'index_images')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/forgot', forgotRouter);
app.use('/Verify_email', verifyRouter);
app.use('/reset', resetRouter);
app.use('/logout', logoutRouter);
app.use('/settings', settingsRouter);
app.use('/search_match', searchMatchRouter);
app.use('/My_pictures', myPicturesRouter);
app.use('/match_full_info', fullProfile);
app.use('/add_like', addLike);
app.use('/delete_like', deleteLike);
app.use('/add_connection', addConnection);
app.use('/delete_connection', deleteConnection);
app.use('/accept_connection', acceptConnection);
app.use('/decline_connection', declineConnection);
app.use('/connection_requests', connectionRequests);
app.use('/upload_images', uploadImages);
app.use('/remove_image', removeImage);
app.use('/chats', chats);
app.use('/messages', messages)


io.on('connection', (socket) => {
    console.log("user has connected");
    
    socket.on("loginMsg", (msg) => {
        socket.emit('id', socket.id);
    });
    // we have to do for the disconnecting on the page close and on the log out
});

server.listen(port, () => console.log(`listening on port ${port}`));

































 // socket.on('like_notification', (data) => {
    //     console.log(data.my_username);
    // })
    // socket.on('room', (data) => {
    //     socket.join(data.room_id);
    //     console.log("Socket joined room: "+data.room_id);
    // })
    // socket.on('chat', (data) => {
    //     db.query("INSERT INTO messages (username, message, room_id) VALUES (?, ?, ?)", [data.username, data.message, data.room_id], (err, resulsts) => {
    //         if (err)
    //             res.send("An error has occured");
    //         else
    //         {
    //             io.sockets.to(data.room_id).emit('chat', {message: data.message, username: data.username});
    //         }
    //     });
    // });
    // socket.on('leave', (data) => {
    //     socket.leave(data.room_id);
    // })