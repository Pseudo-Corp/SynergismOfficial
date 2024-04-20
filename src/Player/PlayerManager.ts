import type { Player as IPlayer } from '../types/Synergism'
import type { PlayerSave as ILegacyPlayer } from '../types/LegacySynergism'
import type Decimal from 'break_infinity.js'

import { ValueRef } from './Value'
import { NumberValue } from './NumberValue'
import { DecimalValue } from './DecimalValue'
import { type DefaultTransformer, TransformRef } from './TransformRef'
import { BooleanValue } from './BooleanValue'

export type InferRefType<K, V> = V extends number
  ? NumberValue<K>
  : V extends Decimal
    ? DecimalValue<K>
    : V extends boolean
      ? BooleanValue<K>  
      : ValueRef<K, V>

export type ManyKeysRaw<Interface, Keys extends (keyof Interface)[]> = Pick<Interface, Keys[number]>

export type ManyKeys<Interface, Keys extends (keyof Interface)[]> = {
  [K in Keys[number]]: InferRefType<K, Interface[K]>
}

export class Player<CurrentPlayer = IPlayer, LegacyPlayer = ILegacyPlayer> {
  private static player: Player
  
  static {
    Player.player = new Player()
  }
  
  static get () {
    return Player.player
  }

  #store = new Map<
    keyof CurrentPlayer,
    ValueRef<keyof CurrentPlayer, unknown>
  >()

  #transforms = new Map<
    keyof LegacyPlayer,
    TransformRef<keyof LegacyPlayer>
  >()

  add <K extends keyof CurrentPlayer>(key: K, value?: CurrentPlayer[K]) {
    const ref = new ValueRef(key, value)
    this.#store.set(key, ref)
    return ref
  }

  addNum <K extends keyof CurrentPlayer>(key: K, value = 0) {
    const ref = new NumberValue(key, value)
    this.#store.set(key, ref)
    return ref
  }

  addDec <K extends keyof CurrentPlayer>(
    key: K,
    //  value: Decimal | null = null,
    defaultValue: string
  ) {
    const ref = new DecimalValue(key, null, defaultValue)
    this.#store.set(key, ref)
    return ref
  }

  addBool <K extends keyof CurrentPlayer>(key: K, state = false) {
    const ref = new BooleanValue(key, state)
    this.#store.set(key, ref)
    return ref
  }

  transform <K extends keyof LegacyPlayer> (key: K, transform: DefaultTransformer) {
    const ref = new TransformRef(key, transform)
    this.#transforms.set(key, ref)
    return ref
  }

  get <K extends keyof CurrentPlayer> (key: K) {
    const ref = this.#store.get(key)
    return ref as InferRefType<K, CurrentPlayer[K]>
  }

  raw <K extends keyof CurrentPlayer>(key: K) {
    const ref = this.get(key)
    return ref.raw() as CurrentPlayer[K]
  }

  manyRaw <K extends (keyof CurrentPlayer)[]>(...keys: K) {
    return keys.reduce((obj, key) => {
      obj[key] = this.raw(key)
      return obj
    }, {} as ManyKeysRaw<CurrentPlayer, K>)
  }

  getMany <K extends (keyof CurrentPlayer)[]>(...keys: K) {
    return keys.reduce((obj, key) => {
      obj[key] = this.get(key)
      return obj
    }, {} as ManyKeys<CurrentPlayer, K>)
  }

  /**
   * Saves the game.
   */
  save () {
    const obj: Record<string, unknown> = {}

    for (const [key, value] of this.#store.entries()) {
      obj[key as string] = value
    }

    const file = btoa(JSON.stringify(obj))

    // TODO: do something with it.
  }

  /**
   * Loads the game given a savefile.
   * TODO: do we want to load the data here, or pass it from elsewhere?
   */
  load () {

  }

  /**
   * Resets the game.
   */
  reset () {
    for (const value of this.#store.values()) {
      value.reset()
    }
  }
}
