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

  consumed (consumable: string, displayName: string, startedAt: number) {
    return JSON.stringify({
      type: 'consumed',
      consumable,
      displayName,
      startedAt
    })
  },

  consumableEnded (consumable: string) {
    return JSON.stringify({
      type: 'consumable-ended',
      consumable
    })
  },

  infoAll (active: unknown, inventory: unknown, tips: number) {
    return JSON.stringify({
      type: 'info-all',
      active,
      tips,
      inventory
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
  },

  /* Received after a player buys loti */
  lotus (name: string, amount: number) {
    return JSON.stringify({
      type: 'lotus',
      consumableName: name,
      amount
    })
  },

  /* Received after a player uses a lotus */
  appliedLotus (remaining: number, lifetimePurchased: number) {
    return JSON.stringify({
      type: 'applied-lotus',
      remaining,
      lifetimePurchased
    })
  },

  /* Received when all loti end */
  lotusEnded () {
    return JSON.stringify({
      type: 'lotus-ended'
    })
  },

  /* Received when the timer starts (usually when the player connects, letting them know how many loti they have active) */
  lotusActive (remaining: number) {
    return JSON.stringify({
      type: 'lotus-active',
      remainingMs: remaining
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
    }),
    z.object({
      type: z.literal('applied-lotus'),
      amount: z.number().int().min(0).safe()
    })
  ])
)
