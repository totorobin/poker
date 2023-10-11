<template>
  <div v-if="show" ref="draggableContainer" id="draggable-container">
    <el-row id="draggable-header" @mousedown="dragMouseDown" class="actions" justify="end"><el-button link id="close" @click="show = false">x</el-button></el-row>
    <textarea rows="30" cols="40"
      v-on:keyup.enter.prevent="testing"
      :value="`${JSON.stringify(room, null, 2)}`"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '@/stores'
import useKonami from '@/stores/useKonami'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const draggableContainer = ref(null)

const roomStore = useRoomStore()
const { room } = storeToRefs(roomStore)

const { show } = useKonami()

const positions = ref({
  clientX: 40,
  clientY: 10,
  movementX: 0,
  movementY: 0
})

function testing(event: KeyboardEvent) {
  const value = JSON.parse(event.target.value)
  console.log('update room', value)
  roomStore.emit('49-3', value)
}
function dragMouseDown(event) {
  event.preventDefault()
  // get the mouse cursor position at startup:
  positions.value.clientX = event.clientX
  positions.value.clientY = event.clientY
  document.onmousemove = elementDrag
  document.onmouseup = closeDragElement
}

function elementDrag(event) {
  event.preventDefault()
  positions.value.movementX = positions.value.clientX - event.clientX
  positions.value.movementY = positions.value.clientY - event.clientY
  positions.value.clientX = event.clientX
  positions.value.clientY = event.clientY
  // set the element's new position:
  draggableContainer.value.style.top =
    draggableContainer.value.offsetTop - positions.value.movementY + 'px'
  draggableContainer.value.style.left =
    draggableContainer.value.offsetLeft - positions.value.movementX + 'px'
}

function closeDragElement() {
  document.onmouseup = null
  document.onmousemove = null
}
</script>

<style>
#draggable-container {
  position: absolute;
  top: 60px;
  z-index: 9;
}
#draggable-header {
  z-index: 10;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: right;
}
textarea {
  background-color: transparent;
  overflow: overlay;
}

textarea::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

textarea::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}
</style>
