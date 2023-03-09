<script setup lang="ts">
const props = defineProps<{
  cardValue: string | undefined
}>()
</script>

<template>
  <div class="card">{{ cardValue }}</div>
</template>

<style scoped>
.card {
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  --el-card-border-radius: 10px;
  aspect-ratio: 2.5 / 3.5;
  border-radius: 10px;
  border: 1px solid var(--el-card-border-color);
  background-color: white;
  box-shadow: var(--el-box-shadow-light);


}
</style>
