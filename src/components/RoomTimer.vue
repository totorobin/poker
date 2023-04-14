<script setup lang="ts">
import { useRoomStore } from '@/stores';
import { VideoPlay , VideoPause } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })

const roomStore = useRoomStore()
const { time, timerRunning, endTimer } = storeToRefs(roomStore)
const { startTimer, stopTimer } = roomStore

const setTimer = () => {
    console.log("set timer", time.value)
    startTimer(time.value)
}
</script>

<template>
    <div>
        <el-time-picker :clearable="false"  size="small" v-model="time" :readonly="timerRunning"/>
        <el-button size="small" v-if="!timerRunning" :icon="VideoPlay" @click="setTimer" ></el-button>
        <el-button size="small" v-else :icon="VideoPause" @click="stopTimer" ></el-button>
        <el-dialog v-model="endTimer" :show="true">
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