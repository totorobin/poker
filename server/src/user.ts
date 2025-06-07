import { type Config, starWars, uniqueNamesGenerator } from 'unique-names-generator';
import { type User } from '../../shared/data-model.ts';

const userNameConfig: Config = {
  dictionaries: [starWars],
  style: 'capital',
  length: 1,
};

export class SUser implements User {
  uuid: string
  name: string

  constructor(uuid: string) {
    this.uuid = uuid
    this.name = uniqueNamesGenerator(userNameConfig)
  }
}
