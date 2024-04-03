import type { PlayerSave } from '../types/LegacySynergism'

type Transformer<V extends PlayerSave, K extends keyof V> = (key: K, value: V[K]) => [string, unknown] | null

export type DefaultTransformer = Transformer<PlayerSave, keyof PlayerSave>

export class TransformRef<K> {
  #key: K
  #transform: DefaultTransformer

  constructor (key: K, transform: DefaultTransformer) {
    this.#key = key
    this.#transform = transform
  }
}
