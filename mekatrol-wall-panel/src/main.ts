export * from './components/main-view.ts';

import { useIntervalTimer } from './helpers/timer.ts';
import { useHomeAssistant } from './helpers/HomeAssistant.ts';

function documentReady(documentReadyCallback: () => void) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    documentReadyCallback();
  } else {
    document.addEventListener('DOMContentLoaded', documentReadyCallback);
  }
}

const homeAssistant = useHomeAssistant();
const url = 'http://ha.lan:8123';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlYjI1M2IxZDYyMjk0NDdiOGFmMjg0NmY4ZDAyNjQ4NiIsImlhdCI6MTcxOTY1MDcxMiwiZXhwIjoyMDM1MDEwNzEyfQ.CFX26yTwNAtdZU9xhFDwq-z-r8OxNNKo0WTMKi09buM';

documentReady(() => {
  /****************************************************************************************************
   * Set up home assistant connection
   ****************************************************************************************************/

  let tick = 0;
  useIntervalTimer(async () => {
    if (!homeAssistant.connected) {
      if (!(await homeAssistant.connect(url, token))) {
        return true;
      }

      await homeAssistant.startListening();
    }

    // Increment tick
    tick++;

    if (tick % 10 === 0) {
      await homeAssistant.callService('switch.kitchen_cabinet_lights_led');
    }

    return true;
  }, 1000);
});
