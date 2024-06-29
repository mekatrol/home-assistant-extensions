<template>
  <div class="mekatrol-main-view flex-row">
    <div class="menu flex-col"></div>
    <div class="page flex-col">
      <mekatrol-time-date-card></mekatrol-time-date-card>
      <mekatrol-panic-switch></mekatrol-panic-switch>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.flex-col {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  align-content: center;
}

.flex-row {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.mekatrol-main-view {
  > .menu {
    min-height: 100%;
    min-width: 100px;
    max-width: 100px;
  }
}
</style>
