import { ws } from 'msw'
import { messages, messageSchema } from './util/messages'
import { sleep } from './util/util'

const consumable = ws.link('wss://synergism.cc/consumables/connect')
let tips = 1000
const lotus = {
  inventory: 0,
  used: 0,
  active: 0,
  activeUntil: 0,
  timer: 0
}

export const consumeHandlers = [
  consumable.addEventListener('connection', ({ client }) => {
    console.log('connected', client.url)

    client.send(messages.join())
    sleep(1000).then(() => client.send(messages.infoAll([], [], tips)))

    client.addEventListener('message', ({ data: body }) => {
      const { success, data } = messageSchema.safeParse(body)

      if (!success) {
        console.log('received invalid message', body)
        client.close(1003, 'invalid message')
        return
      }

      switch (data.type) {
        case 'consume': {
          if (data.consumable.includes('TIMESKIP')) {
            const length = data.consumable.includes('SMALL')
              ? 360
              : data.consumable.includes('LARGE')
              ? 720
              : 1440 // jumbo

            sleep(2500).then(() => client.send(messages.timeSkip(data.consumable, length)))
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

          lotus.timer = setTimeout(() => {
            lotus.active -= data.amount
            client.send(messages.lotusEnded())
          }, lotus.activeUntil - Date.now())
        }
      }
    })
  })
]
