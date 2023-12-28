import {Player, User} from "./user";


export class Room {

    id: string;
    users: { [key: string]: Player };
    cardVisible: boolean;
    cards: string[];
    owner?: string;
    actionsOwnerOnly: boolean;
    endTimer: number;
    noVoteWhenVisible: boolean

    constructor(id: string) {
        this.id = id
        this.users = {}
        this.cardVisible = false
        this.endTimer = 0
        this.actionsOwnerOnly = false
        this.noVoteWhenVisible = false
        this.cards = []
    }

    showCards(visible : boolean) {
        this.cardVisible = visible
    }

    actionsAllowed(userId : string) {
        return !this.actionsOwnerOnly || userId === this.owner;
    }

    addPlayer(user : User) {
        this.users[user.uuid] = new Player(user)
    }

    removePlayer(user : User) {
        delete this.users[user.uuid]
    }

    setVote(user : User, value: string) {
        if(this.noVoteWhenVisible && this.cardVisible)
            throw 'VOTE_NOT_ALLOWED'
        const notSet = !this.users[user.uuid].card
        this.users[user.uuid].card = value  // update card value
        return notSet && !!value
    }

    voteDone() {
        return !Object.values(this.users).find(u => !u.card)
    }

    reset() {
        this.cardVisible = false; // hide cards
        Object.keys(this.users).forEach(id => {
            this.users[id].card = null
        })
    }

    getTimer() {
        if(this.endTimer < Date.now())
            this.endTimer = 0
        return this.endTimer
    }

    isNew() {
       return this.cards.length == 0
    }

    init(props : Room) {
        this.cards = props.cards || this.cards
        this.actionsOwnerOnly = props.actionsOwnerOnly || this.actionsOwnerOnly
        this.owner = props.owner || this.owner
        this.noVoteWhenVisible = props.noVoteWhenVisible || this.noVoteWhenVisible
    }
}