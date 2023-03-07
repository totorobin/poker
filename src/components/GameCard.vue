<script setup lang="ts">
const props = defineProps<{
  cardValue: string
}>()
</script>

<template>
  <el-card shadow="always" plain>{{ cardValue }}</el-card>
</template>

<style scoped>
.el-card {
  --el-card-border-radius: 10px;
  aspect-ratio: 2.5 / 3.5;
}
</style>
