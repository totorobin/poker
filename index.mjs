import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express'
import expressWs from 'express-ws'
import ViteExpress  from "vite-express";
import http from 'http'
import { v4 as uuidv4 } from 'uuid';

// Our port
let port = 3000;

// App and server
let app = express();
let server = http.createServer(app).listen(port);    

// Apply expressWs
const ews = expressWs(app, server);

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


ViteExpress.listen(app, 3001, () => console.log("Server is listening..."));