import { ValueRef } from './Value'
import Decimal from 'break_infinity.js'

export class DecimalValue<K> extends ValueRef<K, Decimal> {
  constructor (key: K, value: string | Decimal, defaultValue: string | Decimal) {
    super(key, typeof value === 'string' ? new Decimal(value) : value)

    super.default(() => typeof defaultValue === 'string' ? new Decimal(defaultValue) : defaultValue)
  }

  add (amount: number) {
    this.value.add(amount)
  }

  sub (amount: number) {
    this.value.sub(amount)
  }

  div (amount: number) {
    this.value.div(amount)
  }

  mul (amount: number) {
    this.value.mul(amount)
  }
}
