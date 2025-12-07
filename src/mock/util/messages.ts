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
  },

  lotus (name: string, amount: number) {
    return JSON.stringify({
      type: 'lotus',
      consumableName: name,
      id: "a1b2c3d4-e5f6-7890-1234-567890abcdef", // Just a fake id
      amount
    })
  },

  appliedLotus (startedAt: number, remaining: number, lifetimeSpent: number) {
    return JSON.stringify({
      type: 'applied-lotus',
      startedAt,
      remaining,
      lifetimeSpent
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
      type: z.literal('lotus'),
      amount: z.number().int().nonnegative().safe()
    }),
    z.object({
      type: z.literal('applied-lotus'),
      startedAt: z.number().int().nonnegative().safe(),
      remaining: z.number().int().nonnegative().safe(),
      lifetimeSpent: z.number().int().nonnegative().safe()
    })
  ])
)
