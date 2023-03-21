<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { FullScreen } from '@element-plus/icons-vue'
import { useRoomStore } from '@/stores'

const roomStore = useRoomStore()
const { userName } = storeToRefs(roomStore)

const openInWindow = () => {
  if (userName.value) localStorage.setItem('userName', userName.value)
  window.open(
    window.location.href,
    '',
    'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=440,height=400'
  )
  roomStore.leave()
}
</script>

<template>
    <div class="window-button" @click="openInWindow">
        <el-icon size="20"><FullScreen /></el-icon>
    </div>
</template>

<style scoped>
@media (max-width: 450px) {
  .window-button {
    display: none;
  }
}
</style>