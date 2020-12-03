var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index1.html');
});
var waiting_user =null;


io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });
// io.on('connection', (socket) => {

//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg);
//         socket.emit("event","Server receive message");
//     });

//     socket.on("match",(data)=>{
//         name=data['name']
//         if(waiting_user != null){
//             //TODO: 加入一个房间
//             socket.emit("enter room",{"room_name":"",users:["user1","user2"]});
//         }
//     })

//     socket.on("commit score",(data)=>{
//         room=data['room'];
//         // socket.emit("update score",data,room=room)
//         io.to(room).emit(data)
//     });
//     io.on('connection', (socket) => {
//         socket.on('chat message', (msg) => {
//             console.log('message: ' + msg);
//         });
//     });

// });

http.listen(3000, () => {
    console.log('listening on *:3000');
});
