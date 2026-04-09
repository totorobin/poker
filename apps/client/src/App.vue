<script lang="ts" setup>
  import { RouterView, useRoute } from 'vue-router'
  import { useRoomStore } from '@/store/room.ts'
  import MyHeader from '@/components/MyHeader.vue'
  import { socket } from '@/socket.ts'
  import { useConnectionStore } from '@/store/connection.ts'

  const roomStore = useRoomStore()
  const connectionStore = useConnectionStore()

  const route = useRoute()

  // remove any existing listeners (in case of hot reload)
  socket.off()

  roomStore.bindEvents()
  connectionStore.bindEvents()
</script>

<template>
  <div :class="{ room: route.name === 'room' }" class="common-layout">
    <el-container>
      <el-header><MyHeader /></el-header>
      <el-main><RouterView /></el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<style>
  :root {
    --primary-color-theme: #56ab2f;
    --primary-color-theme-dark: rgb(
      from var(--primary-color-theme) calc(r * 0.25) calc(g * 0.25) calc(b * 0.25)
    );
    --card-back-background-image: url('/card-backs/playing-card-back_old.png');
  }
  /** important : permet d'afficher la fenetre de saisie du user AU DESSUS des notifications  **/
  .el-overlay {
    z-index: 19 !important;
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
  .room {
    background-color: var(--primary-color-theme);
  }
  .el-header {
    height: 50px;
    line-height: 50px;
    background-color: var(--primary-color-theme-dark);
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
