import {Room} from "./room";
import {type Socket} from "socket.io";
import {adjectives, animals, type Config, names, uniqueNamesGenerator} from "unique-names-generator";

const roomNameConfig = {
    dictionaries: [adjectives, animals, names],
    separator: '-',
    length: 2,
} as Config;
export class RoomStore {
    private rooms : Record<string, Room>

    constructor() {
        this.rooms = {}
    }

    getCurrentRoomId(socket : Socket) : string  {
        for(var roomId of socket.rooms) {
            if(roomId !== socket.id && roomId in this.rooms) {
                return roomId
            }
        }
        throw 'no_current_room'
    }

    get(roomId : string) {
        if(roomId in this.rooms)
            return this.rooms[roomId]
        else
            throw 'room_does_not_exist'
    }

    addRoom(roomId : string) {
        this.rooms[roomId] = new Room(roomId)
    }

    removeRoom(roomId : string) {
        delete this.rooms[roomId]
    }

    generateRoomId() {
        let roomId;
        do {
            roomId = uniqueNamesGenerator(roomNameConfig).toLowerCase();
        } while(roomId in this.rooms);
        return roomId
    }

}