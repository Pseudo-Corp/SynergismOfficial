import { Player as IPlayer } from '../types/Synergism'
import { assert } from '../Utility'

const noop = () => {}

export class ValueRef<K, V> {
  private key: K
  protected value: V
  private defaultFn: (() => V) | (() => void) = noop
  private transformFn: (input: IPlayer) => V = (player) => {
    return player[this.key as keyof IPlayer]
  }

  constructor (key: K, value: V) {
    this.key = key
    this.value = value

    queueMicrotask(() => {
      // If a default value is not set, set the default value to the initial value.

      if (this.defaultFn === noop) {
        this.defaultFn = () => value
      }
    })
  }

  /**
   * The default value to be set if one in the provided savefile does NOT exist.
   * 
   * If no default is set, the default is set to the initial value passed.
   */
  default (value: () => V) {
    this.defaultFn = value

    return this
  }

  /**
   * Converts a JSON value from a savefile into the expected value for the data type.
   * 
   * The input passed is the entire savefile.
   */
  transform (t: (input: IPlayer) => V) {
    this.transformFn = t
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

  reset () {
    const ret = this.defaultFn()
    assert(ret !== undefined)
    this.set(ret)
  }

  toJSON () {
    return this.value
  }
}
