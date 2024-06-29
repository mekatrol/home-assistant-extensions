<template>
  <div class="mekatrol-panic-switch">
    <div>
      <button :class="`switch ${model.state === true ? 'active' : ''}`">
        <mekatrol-svg-icon
          width="60"
          name="panic"
          @click="switchClicked"
          :color="`${model.state === true ? 'panic' : ''}`"
        />
      </button>
    </div>
    <div></div>
    <p>{{ model.label }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Emits {
  (evt: 'click'): void;
}

const emit = defineEmits<Emits>();

interface ControlSwitch {
  label: string;
  state: boolean | undefined;
}

const model = ref<ControlSwitch>({
  label: 'Panic',
  state: false
});

const switchClicked = (): void => {
  if (model.value?.state !== undefined) {
    emit('click');
  }
};
</script>

<style scoped lang="css">
.mekatrol-panic-switch {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  background-color: #333;
  padding: 1rem;
  align-items: center;
  margin: 1rem;
  border-radius: 10rem;
  border: 2px solid #ff0000;
}

.mekatrol-panic-switch > div {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.mekatrol-panic-switch > div:first-child {
  font-size: 2em;
}

.mekatrol-panic-switch .offline {
  color: var(--clr-negative);
}

.mekatrol-panic-switch button {
  background-color: inherit;
  border: none;
  padding: 0;
  margin: 0;
  min-height: 66px;
  cursor: pointer;
}
</style>
