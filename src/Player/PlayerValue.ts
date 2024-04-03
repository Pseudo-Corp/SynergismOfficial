import { Player as IPlayer } from '../types/Synergism'

export class ValueRef<K, V> {
  #key: K
  protected value: V
  #default: (() => V) | (() => void) = () => {}
  #transform: (input: IPlayer) => V = (player) => {
    return player[this.#key as keyof IPlayer]
  }

  constructor (key: K, value: V) {
    this.#key = key
    this.value = value
  }

  /**
   * The default value to be set if one in the provided savefile does NOT exist.
   * 
   * If the function passed returns `undefined`, the value is ignored.
   */
  default (value: () => V) {
    this.#default = value

    return this
  }

  /**
   * Converts a JSON value from a savefile into the expected value for the data type.
   * 
   * The input passed is the entire savefile.
   */
  transform (t: (input: IPlayer) => V) {
    this.#transform = t
  }

  get () {
    return this.value
  }

  set (value: V) {
    this.value = value
  }

  raw () {
    return this.value
  }
}
