<script setup lang="ts">
import imgUrl from '@/assets/8cxrbGE6i.jpg'
const props = defineProps<{
  cardValue: string | undefined
}>()
</script>

<template>
  <div :class="{ card : true}" :style="{ background: cardValue === '?'  ? `no-repeat center/100% url(${imgUrl})` : ''}" >{{ cardValue == '?' ? '' : cardValue }}</div>
</template>

<style scoped>
.card {
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  aspect-ratio: 2.5 / 3.5;
  border-radius: 3px;
  border: 1px solid var(--el-card-border-color);
  background-color: white;
  box-shadow: var(--el-box-shadow-light);
}
</style>
