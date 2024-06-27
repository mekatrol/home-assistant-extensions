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
import { MekatrolVuePluginConfig, HomeAssistant, useHomeAssistantGlobal } from '../home-assistant/types';

const homeAssistantGlobal = useHomeAssistantGlobal();

const color = 'magenta';

const _hass = computed<HomeAssistant | undefined>(() => {
  return homeAssistantGlobal.hass;
});

const _config = computed<MekatrolVuePluginConfig | undefined>(() => {
  return homeAssistantGlobal.config;
});
</script>

<style scoped></style>
