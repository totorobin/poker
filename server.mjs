import express from 'express'
import ViteExpress  from "vite-express";
import http from 'http'
//import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io'


let port = 8080;
// App and server
let app = express();
let server = http.createServer(app).listen(port);    

const io = new Server(server)


var rooms = {};

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);

    socket.on('setUserName', (userName) => {
        let oldName = socket.data.userName
        socket.data.userName = userName
        socket.rooms.forEach((roomId) => {
            if(rooms[roomId] != undefined) {
                rooms[roomId].users[socket.id].name = userName  // update room
                io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
                socket.to(roomId).emit('nameChange', {oldName, newName: userName})  // inform action
            }
        })
    })
    socket.on('create', (callback) => {
        console.log('new room for ', socket.data.userName || socket.id)
        let roomId;
        do {
            roomId = Math.floor(Math.random() * 1000000)
        } while(rooms[roomId] != undefined);
        callback({roomId})
        rooms = { ...rooms, [roomId] : {
                id:roomId,
                users: {[socket.id]: {name: socket.data.userName, id: socket.id}},
                cardVisible: false
            }
        }
        socket.join(roomId)
        io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
    })
    socket.on('join', ({roomId}) => {
        console.log('%s joined room %s', socket.data.userName || socket.id, roomId)
        if(rooms[roomId] != undefined) {
            rooms[roomId].users[socket.id] = {name: socket.data.userName, id: socket.id, card: null}
        } else {
            console.log("room creation")
            rooms = { ...rooms, [roomId] : {
                    id:roomId,
                    users: {[socket.id]: {name: socket.data.userName, id: socket.id, card: null}},
                    cardVisible: false
                }
            }
        }
        socket.join(roomId)
        io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
        socket.to(roomId).emit('joined', {name: socket.data.userName})  // inform action
    })
    socket.on('vote', ({value}) => {
        socket.rooms.forEach((roomId) => {
            if(rooms[roomId] != undefined) {
                rooms[roomId].users[socket.id].card = value  // update card value
                io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
                socket.to(roomId).emit('vote',  {name: socket.data.userName, done: !Object.values(rooms[roomId].users).find(u => !u.card)})   // inform action
            }
        })
    })
    socket.on('cardVisible', (value) => {
        socket.rooms.forEach((roomId) => {
            if(rooms[roomId] != undefined) {
                rooms[roomId].cardVisible = value  // update card value
                io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
                socket.to(roomId).emit('visibility', {name: socket.data.userName, state: value})  // inform action
            }
        })
    })
    socket.on('reset', () => {
        socket.rooms.forEach((roomId) => {
            if(rooms[roomId] != undefined) {
                rooms[roomId].cardVisible = false; // hide cards
                Object.keys(rooms[roomId].users).forEach(id => {
                    rooms[roomId].users[id].card = null
                })  // reset card values
                io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
                socket.to(roomId).emit('reset', {name: socket.data.userName})  // inform action
            }
        })
    })
    socket.on('leave', ({roomId}, callback) => {
        console.log(`${socket.id} is leaving room ${roomId}`);
        socket.leave(roomId)
        callback({})
    })
  });

  io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });
  
  io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });

  io.of("/").adapter.on("delete-room", (roomId) => {
    console.log(`room ${roomId} was deleted`);
    delete rooms[roomId]
  });
  
  io.of("/").adapter.on("leave-room", (roomId, userId) => {
    console.log(`socket ${userId} has left room ${roomId}`);
    if(rooms[roomId] != undefined) {
        const userName = rooms[roomId].users[userId].name
        delete rooms[roomId].users[userId]  // update room
        io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
        io.to(roomId).emit('left', userName || userId)  // inform action
    }
  });

/*
var rooms = {};

var aWss = ews.getWss('/');

// Get the /ws websocket route
app.ws('/ws', async function(ws, req) {


    ws.on('message', async function(msg) {
        if(!ws.id) {
            ws.id = uuidv4();
            ws.send(JSON.stringify({userId: ws.id}))
        }
        console.log(msg);
        actionOnRoom(ws,JSON.parse(msg));
        // Start listening for messages
    });

    ws.on('close', async function() {
        let userId = ws.id
        console.log('disconnected',userId);
        var roomIds = []
        var userName = ''
        for (const [id, room] of Object.entries(rooms)) {
            if(room.users[userId]) {
                userName = room.users[userId].name;
                delete room.users[userId]
                if(Object.keys(rooms[id].users).length == 0) {
                    delete rooms[id]
                } else {
                    roomIds.push(id)
                }
            }
        }
        informRooms(roomIds, {text: userName + ' has left the room'})
    })
});


function actionOnRoom(ws, msg) {
    console.log(msg.action)
    var notif = undefined
    switch(msg.action) {
        case "create": 
            do {
                msg.roomId = Math.floor(Math.random() * 1000000)
            } while(rooms[msg.roomId] != undefined);
            rooms = { ...rooms, [msg.roomId] : {
                    id:msg.roomId,
                    users: {[ws.id]: {name: msg.value, id: ws.id}},
                    cardVisible: false
                }
            }
            break;
        case "join" :
            if(rooms[msg.roomId] != undefined) {
                console.log("add user to room")
                var oldName = rooms[msg.roomId].users[ws.id]?.name
                rooms[msg.roomId].users[ws.id] = {name: msg.value, id: ws.id}
                if(oldName) {
                    notif = { text : oldName + ' is now called ' + msg.value }
                } else {
                    notif = { text : msg.value + ' just joined the room' }
                }
            } else {
                console.log("create room")
                rooms = { ...rooms, [msg.roomId] : {
                        id:msg.roomId,
                        users: {[ws.id]: {name: msg.value, id: ws.id}},
                        cardVisible: false
                    }
                }
            }
            break;
        case 'vote' :
            var oldValue = rooms[msg.roomId].users[ws.id].card;
            rooms[msg.roomId].users[ws.id].card = msg.value;
            if(!oldValue) {
                notif = { text : rooms[msg.roomId].users[ws.id].name + ' just voted' }
            }
            if(!Object.values(rooms[msg.roomId].users).find(u => !u.card)) {
                notif = { text : 'Everyone has voted' }
            }
            break;
        case 'show' :
            rooms[msg.roomId].cardVisible = true;
            break;
        case 'hide' :
            rooms[msg.roomId].cardVisible = false;
            break;
        case 'reset' :
            rooms[msg.roomId].cardVisible = false;
            Object.keys(rooms[msg.roomId].users).forEach(id => {
                rooms[msg.roomId].users[id].card = undefined
            })
            break;
        case 'leave' :
            if(msg.roomId && rooms[msg.roomId]) {
                delete rooms[msg.roomId].users[ws.id]
            }
            break;
        default: 
            console.log("no action")
    }

    informRooms([msg.roomId], notif)

}

function informRooms(ids, notif) {

    ids.forEach(roomId => {
        console.log(rooms[roomId])
        aWss.clients.forEach(function (client) {
            if (client.readyState === 1 && rooms[roomId].users[client.id]) {
                console.log("sending to ", client.id)
                client.send(JSON.stringify({ room: rooms[roomId], notification: notif }));
            }
        });
    })

}

*/


// eslint-disable-next-line no-undef
ViteExpress.bind(app, server, () => console.log("Server is listening..."));