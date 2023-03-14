<script setup lang="ts">
import backImg from '@/assets/kisspng-playing-card-visual-arts-tarot-studio-5b07327b32c0c3.8514217315271983312079.png'
import frontImg from '@/assets/playing-card-front.png'
defineProps<{
  cardValue: string | undefined
}>()
</script>

<template>
  <div
    :class="{ card: true }"
    :style="{
      background:
        cardValue === '?'
          ? `no-repeat center/100% url(${backImg})`
          : cardValue
          ? `no-repeat center/90% url(${frontImg})`
          : '',
      border: cardValue && cardValue !== '?' ? '1px solid black' : ''
    }"
  >
    {{ cardValue == '?' ? '' : cardValue }}
  </div>
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
