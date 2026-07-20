import noRelativeFetch from './no-relative-fetch.mjs'
import noDecimalZero from './no-decimal-zero.mjs'

export default {
  meta: { name: 'synergism-rules' },
  rules: {
    'no-relative-fetch': noRelativeFetch,
    'no-decimal-zero': noDecimalZero
  }
}
