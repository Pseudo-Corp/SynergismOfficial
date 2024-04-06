import { ValueRef } from './Value'
import Decimal from 'break_infinity.js'

export class DecimalValue<K> extends ValueRef<K, Decimal> {
  constructor (key: K, value: Decimal | null, defaultValue: string) {
    super(key, value!)

    super.default(() => new Decimal(defaultValue))
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
