<template>
  <div
    class="vue-plugin-container"
    :style="`color: ${color}`"
  >
    <slot></slot>
    <pre>{{ _config }}</pre>
    <pre>{{ _hass?.states['switch.panic_light']?.state }}</pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// import { useIntervalTimer } from 'vue-boosted';
import { DefaultConfig, HomeAssistant, useHomeAssistantGlobal } from '../home-assistant/types';

const homeAssistantGlobal = useHomeAssistantGlobal();

// useIntervalTimer(async () => {
//   if (!_config.value || !_hass.value) {
//     console.log('ouch');
//     return true;
//   }

//   const entityId = _config.value.entity!;
//   const state = _hass.value.states[entityId];
//   const stateStr = state ? state.state : 'unavailable';
//   console.log(stateStr);
//   return true;
// }, 500);

const color = 'magenta';

const _hass = computed<HomeAssistant | undefined>(() => {
  return homeAssistantGlobal.hass;
});

const _config = computed<DefaultConfig | undefined>(() => {
  return homeAssistantGlobal.config;
});
</script>

<style scoped></style>
