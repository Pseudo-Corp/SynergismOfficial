import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { getStoredSave } from './saves/SaveStorage'
import { Notification } from './UpdateHTML'

const MAX_FILE_BYTES = 4 * 1024 * 1024

interface FeedbackResponse {
  error?: string
}

const setStatus = (state: 'pending' | 'error', text: string) => {
  const status = DOMCacheGetOrSet('feedbackStatus')
  status.dataset.state = state
  status.textContent = text
}

const setButtonsDisabled = (form: HTMLFormElement, disabled: boolean) => {
  for (const button of form.querySelectorAll('button')) {
    button.disabled = disabled
  }
}

const selectedFile = (id: string) => (DOMCacheGetOrSet(id) as HTMLInputElement).files?.[0]

const attachCurrentSave = async () => {
  const save = await getStoredSave()

  if (save === null) {
    return
  }

  const transfer = new DataTransfer()
  transfer.items.add(new File([save], 'save.txt'))
  ;(DOMCacheGetOrSet('feedbackSave') as HTMLInputElement).files = transfer.files
}

const submitFeedback = async (form: HTMLFormElement) => {
  const screenshot = selectedFile('feedbackScreenshot')
  const save = selectedFile('feedbackSave')

  if ((screenshot?.size ?? 0) > MAX_FILE_BYTES || (save?.size ?? 0) > MAX_FILE_BYTES) {
    setStatus('error', i18next.t('feedback.fileTooLarge'))
    return
  }

  const body = new FormData()
  body.set('message', (DOMCacheGetOrSet('feedbackMessage') as HTMLTextAreaElement).value)

  if (screenshot) {
    body.set('screenshot', screenshot)
  }

  if (save) {
    body.set('save', save)
  }

  DOMCacheGetOrSet('feedbackDialog').focus()
  setButtonsDisabled(form, true)
  setStatus('pending', i18next.t('feedback.sending'))

  try {
    const response = await fetch('https://synergism.cc/feedback', {
      method: 'POST',
      body,
      credentials: 'include'
    })

    if (!response.ok) {
      const { error } = await response.json() as FeedbackResponse
      setStatus('error', `${error}`)
      return
    }

    form.reset()
    Notification(i18next.t('feedback.sent'))
  } catch (error) {
    setStatus('error', i18next.t('feedback.failed', { error: (error as Error).message }))
  } finally {
    setButtonsDisabled(form, false)
  }
}

export const openFeedbackDialog = () => {
  DOMCacheGetOrSet('feedbackDialog').hidden = false
  DOMCacheGetOrSet('feedbackMessage').focus()
}

export const registerFeedbackForm = () => {
  const dialog = DOMCacheGetOrSet('feedbackDialog')
  const form = DOMCacheGetOrSet('feedbackForm') as HTMLFormElement

  DOMCacheGetOrSet('openFeedback').addEventListener('click', openFeedbackDialog)

  dialog.addEventListener('keydown', (event) => {
    event.stopPropagation()

    if (event.key === 'Escape') {
      DOMCacheGetOrSet('feedbackCancel').click()
    }
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    submitFeedback(form).catch(console.error)
  })

  form.addEventListener('reset', () => {
    DOMCacheGetOrSet('feedbackStatus').textContent = ''
    dialog.hidden = true
    DOMCacheGetOrSet('openFeedback').focus()
  })

  DOMCacheGetOrSet('feedbackAttachSave').addEventListener('click', () => {
    attachCurrentSave().catch(console.error)
  })
}
