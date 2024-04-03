import { ValueRef } from './PlayerValue'

export class BooleanValue<K> extends ValueRef<K, boolean> {

  bool (state: boolean) {
    this.value = state
  }

}