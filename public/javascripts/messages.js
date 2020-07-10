const socket = io();

socket.on('welcomeMsg', (message) => {
    console.log(message);
});

function sendBtn(){
    console.log("we are clicked");
    var msg = document.getElementById("msg").value;
    
    socket.emit('chatMsg1', msg)
}