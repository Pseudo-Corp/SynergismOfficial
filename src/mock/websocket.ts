import { ws } from 'msw'
import { messages, messageSchema } from './util/messages'
import { sleep } from './util/util'

const consumable = ws.link('wss://synergism.cc/consumables/connect')

const HAPPY_HOUR_BELL_COST = 500

let tips = 1000
const lotus = {
  inventory: 0,
  used: 0,
  active: 0,
  activeUntil: 0,
  timer: 0
}

// The real backend keeps these in a Durable Object shared by every player, so they
// live at module scope here rather than per-connection.
const scheduledBells: { id: number; scheduledFor: number }[] = []
let nextScheduledBellId = 1
/** Only spent by scheduling bells; the mock has no other PseudoCoin sink. */
let pseudoCoins = 49001

/** Backs the mocked /stripe/coins route so scheduling visibly moves the balance. */
export const getMockPseudoCoins = () => pseudoCoins

export const consumeHandlers = [
  consumable.addEventListener('connection', ({ client }) => {
    const pendingTimeSkips = new Map<string, string>()

    console.log('connected', client.url)

    client.send(messages.join())
    sleep(1000).then(() =>
      client.send(
        messages.infoAll([], [], tips, scheduledBells.filter((bell) => bell.scheduledFor > Date.now()))
      )
    )

    client.addEventListener('message', ({ data: body }) => {
      if (body === 'ping') {
        client.send('pong')
        return
      }

      const { success, data } = messageSchema.safeParse(body)

      if (!success) {
        console.log('received invalid message', body)
        client.close(1003, 'invalid message')
        return
      }

      switch (data.type) {
        case 'consume': {
          if (data.consumable.includes('TIMESKIP')) {
            const id = crypto.randomUUID()
            const length = data.consumable.includes('SMALL')
              ? 360
              : data.consumable.includes('LARGE')
              ? 720
              : 1440 // jumbo

            pendingTimeSkips.set(id, data.consumable)
            sleep(2500).then(() => client.send(messages.timeSkip(data.consumable, id, length)))
          } else if (data.consumable.includes('LOTUS')) {
            const amount = data.consumable.includes('SINGLE')
              ? 1
              : data.consumable.includes('DOZEN')
              ? 12
              : 50 // Huge bundle

            sleep(2500).then(() => {
              client.send(messages.lotus(data.consumable, amount))
            })
          } else { // Happy Hour Bell
            sleep(1000).then(() => {
              consumable.broadcast(messages.consumed(data.consumable, 'Happy Hour Bell', Date.now() + (1000 * 60 * 60)))
              client.send(messages.thanks())
            })
          }

          return
        }
        case 'confirm': {
          if (pendingTimeSkips.get(data.id) !== data.consumableId) {
            client.send(messages.error('No consumable found with that id'))
            return
          }

          pendingTimeSkips.delete(data.id)
          client.send(messages.thanks())
          return
        }
        case 'applied-tip': {
          const previous = tips
          tips -= data.amount
          messages.appliedTips(Math.max(previous - tips, 0), Math.max(tips, 0))
          return
        }
        case 'applied-lotus': {
          if (lotus.activeUntil < Date.now()) {
            lotus.activeUntil = Date.now()
          }

          lotus.activeUntil += data.amount * 300_000
          console.log('Applying lotus at time', new Date())

          lotus.active += data.amount
          lotus.used += data.amount
          lotus.inventory -= data.amount

          client.send(messages.appliedLotus(lotus.activeUntil - Date.now(), lotus.used))

          if (lotus.timer) {
            clearTimeout(lotus.timer)
          }

          lotus.timer = +setTimeout(() => {
            lotus.active -= data.amount
            client.send(messages.lotusEnded())
          }, lotus.activeUntil - Date.now())
          return
        }
        case 'schedule-bell': {
          if (data.scheduledFor <= Date.now()) {
            client.send(messages.warn('Bells can only be scheduled in the future.'))
            return
          }

          if (pseudoCoins < HAPPY_HOUR_BELL_COST) {
            client.send(
              messages.warn(`A Happy Hour Bell costs ${HAPPY_HOUR_BELL_COST} PseudoCoins - you don't have enough!`)
            )
            return
          }

          pseudoCoins -= HAPPY_HOUR_BELL_COST

          const bell = { id: nextScheduledBellId++, scheduledFor: data.scheduledFor }
          scheduledBells.push(bell)

          client.send(messages.bellScheduleConfirmed())
          consumable.broadcast(messages.bellScheduled(bell.id, bell.scheduledFor))

          const delay = bell.scheduledFor - Date.now()

          // setTimeout delays past the 32-bit limit fire immediately, so bells scheduled
          // more than ~24 days out just sit in the list until the page is reloaded.
          if (delay <= 0x7fffffff) {
            setTimeout(() => {
              scheduledBells.splice(scheduledBells.indexOf(bell), 1)
              consumable.broadcast(messages.consumed('HAPPY_HOUR_BELL', 'Happy Hour Bell', Date.now()))
            }, delay)
          }
        }
      }
    })
  })
]
