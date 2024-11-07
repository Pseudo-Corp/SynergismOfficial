import { testing } from './Config'
import { setAccount } from './Login'
import { assert } from './Utility'

export function setupTestingTab () {
  assert(testing, 'not in testing')

  const tab = document.getElementById('testing')!
  const accountSelect = tab.querySelector<HTMLSelectElement>('select#account-type-select')!
  const accountOptions = Array.from(accountSelect.querySelectorAll<HTMLOptionElement>('option'))

  for (const option of accountOptions) {
    option.addEventListener('click', () => {
      accountSelect.disabled = true

      fetch(`https://synergism.cc/api/test/login?${option.value}=1`)
        .then((response) => response.json())
        .then((account) => setAccount(account))
        .finally(() => accountSelect.disabled = false)
    })
  }
}
