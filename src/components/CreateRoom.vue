<script setup lang="ts">
import { useRoomStore } from '@/stores/store'
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
  <el-row :gutter="6">
    <el-col :span="6">
      <div>
        <h2>{{ t('titles.new-room') }}</h2>
        <el-button @click="create">{{ t('buttons.new-room') }}</el-button>
      </div>
    </el-col>
    <el-col :span="6">
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
