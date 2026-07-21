import noDecimalZero from './no-decimal-zero.mjs'
import noRelativeFetch from './no-relative-fetch.mjs'

export default {
  meta: { name: 'synergism-rules' },
  rules: {
    'no-relative-fetch': noRelativeFetch,
    'no-decimal-zero': noDecimalZero
  }
}
