
export interface User {
    id: string
    name: string
    card: string | null
  }
  
 export interface Room {
    id: string
    name: string
    users: { [key: string]: User }
    cardVisible: boolean
    cards: string[]
    owner: string
    actionsOwnerOnly: boolean
  }
  
 export interface SavedRoom {
    roomId : string,
    cards : string[]
    owner: string
    actionsOwnerOnly: boolean
  }

  export const BACK_CARD_VALUE = ';'