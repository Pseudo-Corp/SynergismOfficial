import { ValueRef } from './Value'

export class BooleanValue<K> extends ValueRef<K, boolean> {
  bool (state: boolean) {
    this.value = state
  }

  true () {
    this.value = true
  }

  false () {
    this.value = false
  }
}
