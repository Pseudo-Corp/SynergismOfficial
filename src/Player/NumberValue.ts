import { ValueRef } from './Value'

export class NumberValue<K> extends ValueRef<K, number> {
  add (amount: number) {
    this.value += amount
  }

  sub (amount: number) {
    this.value -= amount
  }

  div (amount: number) {
    this.value /= amount
  }

  mul (amount: number) {
    this.value *= amount
  }
}
