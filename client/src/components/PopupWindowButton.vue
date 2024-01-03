<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { FullScreen } from '@element-plus/icons-vue'
  import { useRoomStore } from '../store/room.ts'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n({ useScope: 'global' })

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
  <el-tooltip class="box-item" effect="dark" :content="t('tooltips.popup')" placement="top-start">
    <div class="window-button" @click="openInWindow">
      <el-icon><FullScreen /></el-icon>
    </div>
  </el-tooltip>
</template>

<style scoped>
  .window-button {
    padding: 0 5px;
    margin-top: 2px;
  }

  @media (max-width: 450px) {
    .window-button {
      display: none;
    }
  }
</style>
