<template></template>

<script setup lang="ts">
interface Props {
  name: string;
  color?: string;
}

withDefaults(defineProps<Props>(), {
  color: 'current'
});
</script>
