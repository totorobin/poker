<script setup lang="ts">
import {useRoomStore} from '../store/room.ts'
import {VideoPause, VideoPlay} from '@element-plus/icons-vue'
import {storeToRefs} from 'pinia'
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

  const roomStore = useRoomStore()
  const { time, timerRunning, endTimer, actionsAllowed } = storeToRefs(roomStore)
  const { startTimer, stopTimer } = roomStore

  const setTimer = () => {
    console.log('set timer', time.value)
    startTimer(time.value + 1000)
  }

  const dateTime = computed({
    get: () => {
      const val = new Date()
      val.setHours(Math.floor(time.value / 3600000))
      val.setMinutes(Math.floor((time.value % 3600000) / 60000))
      val.setSeconds(Math.floor((time.value % 60000) / 1000))
      return val
    },
    set: (newVal) => {
      time.value =
        newVal.getHours() * 3600000 + newVal.getMinutes() * 60000 + newVal.getSeconds() * 1000
    }
  })
</script>

<template>
  <div>
    <el-time-picker v-model="dateTime" :clearable="false" size="small" :readonly="timerRunning" />
    <el-button
      v-if="!timerRunning"
      :disabled="!actionsAllowed"
      size="small"
      :icon="VideoPlay"
      @click="setTimer"
    ></el-button>
    <el-button
      v-else
      :disabled="!actionsAllowed"
      size="small"
      :icon="VideoPause"
      @click="stopTimer"
    ></el-button>
    <el-dialog v-model="endTimer" :show="true" @close="time = 3600000">
      <p class="msg-end-timer">{{ t('notifications.end-timer') }}</p>
    </el-dialog>
  </div>
</template>

<style>
  .el-date-editor.el-input {
    --el-date-editor-width: 90px;
  }
</style>

<style scoped>
  .el-button {
    margin-left: -5px;
    position: relative;
    z-index: 10;
    font-size: 18px;
    padding: 3px 3px;
  }
  .msg-end-timer {
    text-align: center;
  }
</style>
