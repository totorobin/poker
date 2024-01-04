import { Player, type User, Room } from '@shared/data-model';


export class SRoom extends Room {

  constructor(id: string) {
    super(id)
  }

  showCards(visible: boolean): void {
    this.cardVisible = visible;
  }

  actionsAllowed(userId: string): boolean {
    return !this.actionsOwnerOnly || userId === this.owner;
  }

  addPlayer(user: User): void {
    this.users[user.uuid] = new Player(user);
  }

  removePlayer(user: User): void {
    delete this.users[user.uuid];
  }

  setVote(user: User, value: string | null): boolean {
    if (this.noVoteWhenVisible && this.cardVisible) {
      throw new Error('VOTE_NOT_ALLOWED');
    }
    const notSet = this.users[user.uuid].card == null;
    this.users[user.uuid].card = value; // update card value
    return notSet && value != null;
  }

  voteDone(): boolean {
    return Object.values(this.users).find((u) => u.card == null) !== undefined;
  }

  reset(): void {
    this.cardVisible = false; // hide cards
    Object.keys(this.users).forEach((id) => {
      this.users[id].card = null;
    });
  }

  getTimer(): number {
    if (this.endTimer < Date.now()) {
      this.endTimer = 0;
    }
    return this.endTimer;
  }

  isNew(): boolean {
    return this.cards.length === 0;
  }

  init(props: Room): void {
    this.cards = props.cards ?? this.cards;
    this.actionsOwnerOnly = props.actionsOwnerOnly ?? this.actionsOwnerOnly;
    this.owner = props.owner ?? this.owner;
    this.noVoteWhenVisible = props.noVoteWhenVisible ?? this.noVoteWhenVisible;
  }
}
