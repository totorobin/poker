import express from 'express'
import ViteExpress  from "vite-express";
import http from 'http'
//import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io'
import { uniqueNamesGenerator, adjectives, animals, names, starWars } from 'unique-names-generator';

// eslint-disable-next-line no-undef
let port = process.env.PORT || 8080;
// App and server
let app = express();
let server = http.createServer(app).listen(port);    

const io = new Server(server)

const roomNameConfig = {
    dictionaries: [adjectives, animals, names],
    separator: '-',
    length: 2,
  };


  const userNameConfig = {
    dictionaries: [starWars],
    style: 'capital',
    length: 1,
  };

var rooms = {};


class Room {
    constructor(id) {
        this.id = id;
        this.users = {},
        this.cardVisible = false
    }

    toJSON() {
        return { cardVisible: this.cardVisible, id: this.id, users: [ ...Object.entries(this.users).map(([key, value]) => ({ id: key, name: value.name, card: this.cardVisible ? value.card : null, vote: !!value.card }))]}
    }
}

io.on('connection', (socket) => {
    socket.data.userName = uniqueNamesGenerator(userNameConfig)
    console.log(`user ${socket.data.userName} connected`);

    socket.on('whoAmI', (callback) => {
        callback(socket.data)
    })

    socket.on('setUserName', (userName) => {
        let oldName = socket.data.userName
        socket.data.userName = userName
        socket.rooms.forEach((roomId) => {
            if(roomId in rooms) {
                rooms[roomId].users[socket.id].name = userName  // update room
                io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
                socket.to(roomId).emit('nameChange', {oldName, newName: userName})  // inform action
            }
        })
    })
    socket.on('create', (callback) => {
        let roomId;
        do {
            roomId = uniqueNamesGenerator(roomNameConfig);
        } while(roomId in rooms);
        console.log(`new room for ${socket.data.userName} : ${roomId}`)
        callback({roomId})
        socket.join(roomId)
    })
    socket.on('join', ({roomId}) => {
        socket.join(roomId)
        
    })
    socket.on('vote', ({value}) => {
        socket.rooms.forEach((roomId) => {
            if(roomId in rooms) {
                const oldValue = rooms[roomId].users[socket.id].card
                rooms[roomId].users[socket.id].card = value  // update card value
                if((!oldValue && !!value) || (!!oldValue && !value) || rooms[roomId].cardVisible )
                    io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
                if(!oldValue && !!value)
                    socket.to(roomId).emit('vote',  {name: socket.data.userName, done: !Object.values(rooms[roomId].users).find(u => !u.card)})   // inform action
            }
        })
    })
    socket.on('cardVisible', (value) => {
        socket.rooms.forEach((roomId) => {
            if(roomId in rooms) {
                rooms[roomId].cardVisible = value  // update card value
                io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
                socket.to(roomId).emit('visibility', {name: socket.data.userName, state: value})  // inform action
            }
        })
    })
    socket.on('reset', () => {
        socket.rooms.forEach((roomId) => {
            if(roomId in rooms) {
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

  io.of("/").adapter.on("create-room", (roomId) => {
    rooms = { ...rooms,
        [roomId] : new Room(roomId)
    }
  });
  
  io.of("/").adapter.on("join-room", async (roomId, userId) => {
    if(roomId !== userId) {  // ignore user room
        const socket = (await io.in(userId).fetchSockets())[0];
        rooms[roomId].users[userId] = {name: socket.data.userName, card: null}
        io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
        socket.to(roomId).emit('joined', {name: socket.data.userName})  // inform action
        console.log(`user ${socket.data.userName} has joined room ${roomId}`);
    } else {
        delete rooms[roomId]
    }
  });

  io.of("/").adapter.on("delete-room", (roomId) => {
    if(roomId in rooms) {
        delete rooms[roomId]
        console.log(`room ${roomId} was deleted`);
        console.log(`current rooms : ${Object.keys(rooms).length}`)
    }
  });
  
  io.of("/").adapter.on("leave-room", async (roomId, userId) => {
    console.log(`socket ${userId} has left room ${roomId}`);
    if(roomId in rooms) {
        let userName = rooms[roomId].users[userId].name
        delete rooms[roomId].users[userId]  // update room
        io.to(roomId).emit('roomState', rooms[roomId])  // emit new state
        io.to(roomId).emit('left', {name: userName})  // inform action
    }
  });


// eslint-disable-next-line no-undef
ViteExpress.bind(app, server, () => console.log("Server is listening..."));