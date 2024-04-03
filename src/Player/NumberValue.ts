import { ValueRef } from './PlayerValue'

export class NumberValue<K> extends ValueRef<K, number> {
  add (amount: number) {
    this.value += amount
  }
}
