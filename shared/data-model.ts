
export class Room {
  id: string;
  users: Record<string, Player>;
  cardVisible: boolean;
  cards: string[];
  owner?: string;
  actionsOwnerOnly: boolean;
  endTimer: number;
  noVoteWhenVisible: boolean;

  constructor(id: string) {
    this.id = id;
    this.users = {};
    this.cardVisible = false;
    this.endTimer = 0;
    this.actionsOwnerOnly = false;
    this.noVoteWhenVisible = false;
    this.cards = [];
  }
}

export class User {
  uuid: string;
  name: string;

  constructor(uuid: string) {
    this.uuid = uuid;
    this.name = ""
  }
}

export class Player extends User {
  card: string | null;

  constructor(user: User) {
    super(user.uuid);
    this.name = user.name;
    this.card = null;
  }
}

export enum Notification {
    nameChange = 'name-changed',
    vote = 'vote',
    voteDone = 'vote-done',
    voteBlocked = 'vote-blocked',
    show = 'show',
    hide = 'hide',
    reset = 'reset',
    leftRoom = 'left',
    joinedRoom = 'join',
    cheated = 'cheated',
  }

 export interface ServerToClientEvents {
    notify: (args: { type: Notification; values: object }) => void;
    roomState: (room: Room) => void;
  }
  
 export interface ClientToServerEvents {
    whoAmI: (callback: (me: User) => void) => void;
    setUserUUID: (uuid: string) => void;
    setUserName: (name: string) => void;
    create: (callback: (res: { roomId: string }) => void) => Promise<void>;
    join: (args: { roomId: string }) => Promise<void>;
    vote: (args: { value: string }) => void;
    cardVisible: (value: boolean) => void;
    reset: () => void;
    leave: (args: { roomId: string }, callback: (e: User) => void) => void;
    timer: (args: { endTime: number }) => void;
    updateSettings: (props: Room) => void;
  }

export interface SavedRoom {
  id: string
  cards: string[]
  owner: string
  actionsOwnerOnly: boolean
  noVoteWhenVisible: boolean
}

export const BACK_CARD_VALUE = ';'
