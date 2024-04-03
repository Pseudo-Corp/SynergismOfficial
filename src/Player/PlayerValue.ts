export class ValueRef<K, V> {
  #key: K
  protected value: V
  #default?: V

  constructor (key: K, value: V) {
    this.#key = key
    this.value = value
  }

  default (value: V) {
    this.#default = value
    return this
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
