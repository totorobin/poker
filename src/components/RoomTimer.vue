<script setup lang="ts">
import { useRoomStore } from '@/stores';
import { VideoPlay , VideoPause } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

const roomStore = useRoomStore()
const { time, timerRunning } = storeToRefs(roomStore)
const { startTimer, stopTimer } = roomStore

const setTimer = () => {
    console.log("set timer", time.value)
    startTimer(time.value)
}

</script>

<template>
        <el-time-picker v-model="time" placeholder="Set Timer" />
        <el-button v-if="!timerRunning" type="primary" :icon="VideoPlay" @click="setTimer" ></el-button>
        <el-button v-else type="primary" :icon="VideoPause" @click="stopTimer" ></el-button>
</template>