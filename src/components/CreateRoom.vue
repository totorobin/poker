<script setup lang="ts">
import { useRoomStore } from '@/stores'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })

const roomStore = useRoomStore()
const roomForm = ref(localStorage.getItem('roomId') || '')

function joinRoom() {
  roomStore.joinRoom(roomForm.value)
}

function create() {
  roomStore.createRoom()
}
</script>

<template>
  <el-row>
    <el-col :span="8">
      <div>
        <h2>{{ t('titles.new-room') }}</h2>
        <el-button @click="create">{{ t('buttons.new-room') }}</el-button>
      </div>
    </el-col>
    <el-col :span="16">
      <div>
        <h2>{{ t('titles.join-room') }}</h2>
        <el-input v-model="roomForm" placeholder="room id" v-on:keyup.enter="joinRoom">
          <template #append>
            <el-button @click="joinRoom">{{ t('buttons.join-room') }}</el-button>
          </template>
        </el-input>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-row { 
  max-width: 1000px;
  margin: 0 auto;
}
</style>
