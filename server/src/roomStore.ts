import { Room } from './room';
import { type Socket } from 'socket.io';
import { adjectives, animals, type Config, names, uniqueNamesGenerator } from 'unique-names-generator';

const roomNameConfig: Config = {
  dictionaries: [adjectives, animals, names],
  separator: '-',
  length: 2,
};

export class RoomStore {
  private rooms: Record<string, Room>;

  constructor() {
    this.rooms = {};
  }

  getCurrentRoomId(socket: Socket<any, any, any, any>): string {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id && roomId in this.rooms) {
        return roomId;
      }
    }
    throw new Error('no_current_room');
  }

  get(roomId: string): Room {
    if (roomId in this.rooms) {
      return this.rooms[roomId];
    } else {
      throw new Error('room_does_not_exist');
    }
  }

  addRoom(roomId: string): void {
    this.rooms[roomId] = new Room(roomId);
  }

  removeRoom(roomId: string): void {
    delete this.rooms[roomId];
  }

  generateRoomId(): string {
    let roomId;
    do {
      roomId = uniqueNamesGenerator(roomNameConfig).toLowerCase();
    } while (roomId in this.rooms);
    return roomId;
  }
}
