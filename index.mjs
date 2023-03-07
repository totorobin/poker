import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express'
import expressWs from 'express-ws'
import http from 'http'
import {uuid} from 'uuidv4'

// Our port
let port = 3000;

// App and server
let app = express();
let server = http.createServer(app).listen(port);    

// Apply expressWs
const ews = expressWs(app, server);

app.use(express.static(__dirname + '/views'));

// Get the route / 
app.get('/', (req, res) => {
    res.status(200).send("Welcome to our app");
});

var rooms = {};

var aWss = ews.getWss('/');

// Get the /ws websocket route
app.ws('/ws', async function(ws, req) {


    ws.on('message', async function(msg) {
        if(!ws.id) {
            ws.id = req.headers['sec-websocket-key'];
            ws.send(JSON.stringify({userId: ws.id}))
        }
        console.log(msg);
        actionOnRoom(ws,JSON.parse(msg));
        // Start listening for messages
    });

    ws.on('close', async function() {
        let userId = ws.id
        console.log('disconnected',userId);
        for (const [id, room] of Object.entries(rooms)) {
            if(room.users[userId]) {
                delete room.users[userId]
                if(Object.keys(rooms[id].users).length == 0) {
                    delete rooms[id]
                } else {
                    aWss.clients.forEach(client => {
                        if(rooms[id].users[client.id]) {
                            if (client.readyState === 1) {
                                console.log("sending to ", client.id)
                                client.send(JSON.stringify(rooms[id]));
                            }
                        }
                    })
                }
            }
        }
    })
});

function actionOnRoom(ws, msg) {
    console.log(msg.action)

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
            ws.send(JSON.stringify(rooms[msg.roomId]));
            break;
        case "join" :
            if(rooms[msg.roomId] != undefined) {
                console.log("add user to room")
                rooms[msg.roomId].users[ws.id] = {name: msg.value, id: ws.id}
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
            rooms[msg.roomId].users[ws.id].card = msg.value;
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

    console.log(rooms)
    aWss.clients.forEach(function (client) {
        if (client.readyState === 1 && rooms[msg.roomId].users[client.id]) {
            console.log("sending to ", client.id)
            client.send(JSON.stringify(rooms[msg.roomId]));
        }
    });

}