import { type Config, starWars, uniqueNamesGenerator } from 'unique-names-generator';

const userNameConfig: Config = {
  dictionaries: [starWars],
  style: 'capital',
  length: 1,
};

export class User {
  uuid: string;
  name: string;

  constructor(uuid: string) {
    this.uuid = uuid;
    this.name = uniqueNamesGenerator(userNameConfig);
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
