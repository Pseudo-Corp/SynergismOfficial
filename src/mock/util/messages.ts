import { z } from 'zod'

export const messages = {
  join () {
    return JSON.stringify({ type: 'join' })
  },

  error (message: string) {
    return JSON.stringify({
      type: 'error',
      message
    })
  },

  warn (message: string) {
    return JSON.stringify({
      type: 'warn',
      message
    })
  },

  consumed (consumable: string, at: number) {
    return JSON.stringify({
      type: 'consumed',
      consumable,
      startedAt: at
    })
  },

  consumableEnded (consumable: string, ended: string) {
    return JSON.stringify({
      type: 'consumable-ended',
      consumable,
      endedAt: Date.parse(ended)
    })
  },

  infoAll (active: unknown, tips: number) {
    return JSON.stringify({
      type: 'info-all',
      active,
      tips
    })
  },

  thanks () {
    return JSON.stringify({
      type: 'thanks'
    })
  },

  tip (tips: number) {
    return JSON.stringify({
      type: 'tips',
      tips
    })
  },

  timeSkip (name: string, amount: number) {
    return JSON.stringify({
      type: 'time-skip',
      consumableName: name,
      amount
    })
  },

  appliedTips (amount: number, remaining: number) {
    return JSON.stringify({
      type: 'applied-tip',
      amount,
      remaining
    })
  }
}

export const messageSchema = z.preprocess(
  (arg, ctx) => {
    if (typeof arg === 'string') {
      try {
        return JSON.parse(arg)
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Received non-JSON message' })
        return
      }
    }

    ctx.addIssue({ code: 'custom', message: 'Received non-string message' })
  },
  z.union([
    z.object({ type: z.literal('consume'), consumable: z.string() }),
    z.object({
      type: z.union([z.literal('applied-tip'), z.literal('use-tips')]),
      amount: z.number().int().nonnegative().safe()
    })
  ])
)
