import { SRoom } from './room.ts';
import { type Socket } from 'socket.io';
import { adjectives, animals, type Config, names, uniqueNamesGenerator } from 'unique-names-generator';

const roomNameConfig: Config = {
  dictionaries: [adjectives, animals, names],
  separator: '-',
  length: 2,
};

export class RoomStore {
    private rooms: Record<string, SRoom>

    constructor() {
        this.rooms = {}
  }

    getCurrentRoomId(socket: Socket<any, any, any>): string {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id && roomId in this.rooms) {
          return roomId
      }
    }
        throw new Error('no_current_room')
  }

    isRoomId(roomId: string): boolean {
        return roomId in this.rooms
  }

    get(roomId: string): SRoom {
    if (roomId in this.rooms) {
        return this.rooms[roomId]
    } else {
        throw new Error('room_does_not_exist')
    }
  }

    addRoom(roomId: string): void {
        this.rooms[roomId] = new SRoom(roomId)
  }

    removeRoom(roomId: string): void {
        delete this.rooms[roomId]
        console.log(`room ${roomId} was deleted`)
        console.log(`rooms left : ${Object.keys(this.rooms).length}`)
  }

    generateRoomId(): string {
        let roomId
    do {
        roomId = uniqueNamesGenerator(roomNameConfig).toLowerCase()
    } while (roomId in this.rooms)
        return roomId
  }
}
