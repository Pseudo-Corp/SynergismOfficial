import { setActivity, start } from 'tauri-plugin-drpc'
import { Activity, Button } from 'tauri-plugin-drpc/activity'

start('1289263890445631581')
  .then(async () => {
    console.log('rich presence initialized')

    const activity = new Activity()
      .setDetails('Playing Synergism')
      .setState('Idle Gaming')
      .setButton([new Button('Play Synergism', 'https://synergism.cc')])

    await setActivity(activity)
  })
  .catch((e) => console.error(e))
