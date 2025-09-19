import { ws } from 'msw'
import { messages, messageSchema } from './util/messages'
import { sleep } from './util/util'

const consumable = ws.link('wss://synergism.cc/consumables/connect')
let tips = 1000

export const consumeHandlers = [
  consumable.addEventListener('connection', ({ client }) => {
    console.log('connected', client.url)

    client.send(messages.join())
    sleep(1000).then(() =>
      client.send(messages.infoAll([
        {
          name: 'Happy Hour Bell',
          internalName: 'HAPPY_HOUR_BELL',
          endsAt: Date.now() + (1000 * 60 * 60)
        }
      ], tips))
    )

    client.addEventListener('message', ({ data: body }) => {
      const { success, data } = messageSchema.safeParse(body)

      if (!success) {
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
        }
      }
    })
  })
]
