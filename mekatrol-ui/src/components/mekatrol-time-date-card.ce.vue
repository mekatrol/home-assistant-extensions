<template>
  <div class="mekatrol-time-date-card">
    <div class="time">{{ timeDisplay }}</div>
    <div class="date">{{ dateDisplay }}</div>
  </div>
</template>

<script setup lang="ts">
import { getShortDateWithDay, getTimeWithMeridiem } from '../utils/date-helper';
import { ref } from 'vue';
import { useIntervalTimer } from 'vue-boosted';

const timeDisplay = ref('');
const dateDisplay = ref('');

useIntervalTimer(async () => {
  const dt = new Date();

  timeDisplay.value = getTimeWithMeridiem(dt);
  dateDisplay.value = getShortDateWithDay(dt);
  return true;
}, 500);
</script>

<style scoped lang="css">
.mekatrol-time-date-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  align-items: center;
  width: 100%;
  height: 100%;

  font-family: 'Orbitron', sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
  padding: 3px;

  > .time {
    font-size: 4rem;
    color: #ff0000;
  }

  > .date {
    font-size: 1.5rem;
    color: #fa3354;
    padding: 0.2em;
  }
}
</style>
