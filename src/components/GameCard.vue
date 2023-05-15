<script setup lang="ts">
import { BACK_CARD_VALUE } from '@/data-model'
defineProps<{
  cardValue: string | null
}>()
</script>

<template>
  <div
    :class="{
      card: true,
      cardBack: cardValue === BACK_CARD_VALUE,
      cardFront: cardValue && cardValue !== BACK_CARD_VALUE,
    }"
  >{{ cardValue == BACK_CARD_VALUE ? '' : cardValue }}
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
  border-radius: 7px;
  border: 1px solid var(--el-card-border-color);
  box-shadow: var(--el-box-shadow-light);
  transition: box-shadow .2s ease-in-out, transform .2s ease-in-out;
  box-shadow: 0 0 5px -5px #000;
  background: no-repeat center/100% transparent;
  user-select: none;

}
.cardBack {
  background-image: url('@/assets/playing-card-back.png');
  border: 1px solid black;
}
.cardFront {
  background-image: url('@/assets/playing-card-front.png');
  background-color: whitesmoke;
  border: 1px solid black;
}
</style>
