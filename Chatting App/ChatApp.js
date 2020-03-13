var express = require('express')
 , app = express()
 , http = require('http')
 , server = http.createServer(app)
 , io = require('socket.io').listen(server);
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
 res.sendfile(__dirname + '/public/ChattingPage.html');
});


var usernames = {};

io.sockets.on('connect', function (socket) {

 socket.on('sendchat', function (data) {
 io.sockets.emit('updatechat', socket.username, data);
 });

console.log('user Image Before');

socket.on('base64 file', function (msg) {
    console.log('received base64 file from' + msg.username);
    socket.username = msg.username;
    // socket.broadcast.emit('base64 image', //exclude sender
    io.sockets.emit('base64 file',  //include sender

        {
          username: socket.username,
          file: msg.file,
          fileName: msg.fileName
        }

    );
});




console.log('user Image After');

 socket.on('adduser', function(username){
 socket.username = username;
 usernames[username] = username;
 socket.emit('updatechat', 'SERVER', 'you have connected --- '+ username );
 socket.broadcast.emit('updatechat', 'SERVER'
 , username + ' has connected');
 io.sockets.emit('updateusers', usernames);
 });


 socket.on('disconnect', function(){
 delete usernames[socket.username];
 io.sockets.emit('updateusers', usernames);
 socket.broadcast.emit('updatechat', 'SERVER'
 , socket.username + ' has disconnected');
 });



});
var port = 9000;
server.listen(port);
console.log('Listening on port: ' + port);