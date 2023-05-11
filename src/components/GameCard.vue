<script setup lang="ts">
defineProps<{
  cardValue: string | null
}>()
</script>

<template>
  <div
    :class="{
      card: true,
      cardBack: cardValue === '?',
      cardFront: cardValue && cardValue !== '?',
    }"
  >
    <svg :viewBox="`0 0 ${15+15*(cardValue?.length||0)} 30`">
      <text x="50%" y="100%" text-anchor="middle">
        {{ cardValue == '?' ? '' : cardValue }}
      </text>
    </svg>
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
  font-size: xx-large;
  transition: box-shadow .2s ease-in-out, transform .2s ease-in-out;
  box-shadow: 0 0 5px -5px #000;
  background: no-repeat center/100% transparent;
  user-select: none;
}
.card svg {
  position: absolute;
  left: 20%;
  top: 20%;
  line-height: 0;
  max-width: 60%;
  max-height: 60%;
  aspect-ratio: 1;
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
