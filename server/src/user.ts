import {type Config, starWars, uniqueNamesGenerator} from "unique-names-generator";

const userNameConfig = {
    dictionaries: [starWars],
    style: 'capital',
    length: 1,
} as Config;

export class User {
    uuid: string
    name: string

    constructor(uuid: string) {
        this.uuid = uuid
        this.name = uniqueNamesGenerator(userNameConfig)
    }
}

export class Player extends User {

    card: string | null

    constructor(user : User) {
        super(user.uuid)
        this.name = user.name
        this.card = null
    }

}