
export interface User {
    uuid: string
    name: string
    card: string | null
  }
  
 export interface Room {
    id: string
    users: { [key: string]: User }
    cardVisible: boolean
    cards: string[]
    owner: string
    actionsOwnerOnly: boolean
    endTimer: number
    noVoteWhenVisible: boolean
  }
  
 export interface SavedRoom {
    id : string,
    cards : string[]
    owner: string
    actionsOwnerOnly: boolean
    noVoteWhenVisible: boolean
  }

  export const BACK_CARD_VALUE = ';'