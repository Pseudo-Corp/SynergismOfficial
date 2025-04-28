import { ws } from 'msw'

const consumable = ws.link('wss://synergism.cc/consumables/connect')

export const consumeHandlers = [
  consumable.addEventListener('connection', ({ client }) => {
    console.log('connected', client.url)

    setTimeout(() => {
      client.send(JSON.stringify({ type: 'consumed', consumable: 'HAPPY_HOUR_BELL', startedAt: Date.now() - 20000 }))
    }, 1000)

    setTimeout(() => {
      client.send(JSON.stringify({ type: 'time-skip', consumableName: 'LARGE_AMBROSIA_TIMESKIP', amount: 720 }))
    }, 5000)
    setTimeout(() => {
      client.send(JSON.stringify({ type: 'time-skip', consumableName: 'SMALL_ASCENSION_TIMESKIP', amount: 360 }))
    }, 10000)
    setTimeout(() => {
      client.send(JSON.stringify({ type: 'time-skip', consumableName: 'JUMBO_GLOBAL_TIMESKIP', amount: 1440 }))
    }, 15000)

    client.addEventListener('message', ({ data }) => {
      console.log(data)
    })

    // This was NEVER needed! Fuck me

    /*   const d = messageSchema.parse(data)
            console.log(data)

            if (d.type === 'warn') {
              Notification(d.message, 5_000)
            } else if (d.type === 'error') {
              Notification(d.message, 5_000)
              resetConsumables()
            } else if (d.type === 'consumed') {
              const consumable = allDurableConsumables[d.consumable as PseudoCoinConsumableNames]
              consumable.ends.push(d.startedAt + 3600 * 1000)
              consumable.amount++

              Notification(`Someone redeemed a(n) ${d.consumable}!`)
            } else if (d.type === 'consumable-ended') {
              // Because of the invariant that the timestamps are sorted, we can just remove the first element
              const consumable = allDurableConsumables[d.consumable as PseudoCoinConsumableNames]
              consumable.ends.shift()
              consumable.amount--

              Notification(`A(n) ${d.consumable} ended!`)
            } else if (d.type === 'join') {
              Notification('Connection was established!')
            } else if (d.type === 'info-all') {
              resetConsumables() // So that we can get an accurate count each time
              if (d.active.length !== 0) {
                let message = 'The following consumables are active:\n'

                for (const { internalName, endsAt, name } of d.active) {
                  const consumable = allDurableConsumables[internalName as PseudoCoinConsumableNames]
                  consumable.ends.push(endsAt)
                  consumable.amount++
                  consumable.displayName = name
                }
                // Are these already in order? I assume so but just to be sure

                for (const item of Object.values(allDurableConsumables)) {
                    item.ends.sort((a, b) => a - b)
                }

                for (const { amount, displayName } of Object.values(allDurableConsumables)) {
                  message += `${displayName} (x${amount})`
                }

                Notification(message)
              }

              tips = d.tips
            } else if (d.type === 'thanks') {
              Alert(i18next.t('pseudoCoins.consumables.thanks'))
            } else if (d.type === 'tip-backlog' || d.type === 'tips') {
              tips += d.tips

              Notification(i18next.t('pseudoCoins.consumables.tipReceived', { offlineTime: d.tips }))
            } else if (d.type === 'applied-tip') {
              tips = d.remaining
              calculateOffline(d.amount * 60, true)
              DOMCacheGetOrSet('exitOffline').style.visibility = 'unset'
            } else if (d.type === 'time-skip') {
                console.log('test!')
                const timeSkipName = d.consumableName as PseudoCoinTimeskipNames
                const minutes = d.amount

                // Do the thing with the timeSkip
                activateTimeSkip(timeSkipName, minutes)
                saveSynergy()
            }

            updateGlobalsIsEvent()
        }) */
  })
]
