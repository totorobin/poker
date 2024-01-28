<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'
  import { RouterView } from 'vue-router'
  import { useRoomStore } from '@/store/room.ts'
  import MyHeader from '@/components/MyHeader.vue'
  import { socket } from '@/socket.ts'
  import { useConnectionStore } from '@/store/connection.ts'

  const roomStore = useRoomStore()
  const connectionStore = useConnectionStore()

  const { room } = storeToRefs(roomStore)
  const backgroundColor = computed(() => (room.value.id ? '#56ab2f' : 'white'))

  // remove any existing listeners (in case of hot reload)
  socket.off()

  roomStore.bindEvents()
  connectionStore.bindEvents()
</script>

<template>
  <div class="common-layout" :style="{ 'background-color': backgroundColor }">
    <el-container>
      <el-header><MyHeader /></el-header>
      <el-main><RouterView /></el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<style>
  /** important : permet d'afficher la fenetre de saisie du user AU DESSUS des notifications  **/
  .el-overlay {
    z-index: 99999999999999 !important;
  }

  body {
    margin: 0;
  }

  .el-main {
    overflow: hidden;
  }
  .el-footer {
    z-index: 5;
  }
</style>
<style scoped>
  .el-header {
    height: 50px;
    line-height: 50px;
    background-color: #1a330e;
  }
  .el-container {
    height: 100vh;
  }
  .el-main {
    --el-main-padding: 10px;
  }
  @media (max-width: 450px) {
    .el-header {
      height: 30px;
      line-height: 30px;
    }
  }
</style>
