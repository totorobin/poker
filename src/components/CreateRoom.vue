<script setup lang="ts">
import { useRoomStore } from '@/stores/room'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const roomStore = useRoomStore()
const router = useRouter()
const roomId = computed(() => roomStore.room.id)
const roomForm = ref('')

watch(roomId, async (newId) => {
  if (newId) {
    console.log('roomId : ', newId)

    router.push('/room/' + newId)
  }
})

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
        <h2>new Room</h2>
        <el-button @click="create">create</el-button>
      </div>
    </el-col>
    <el-col :span="6">
      <div>
        <h2>Join Room</h2>
        <el-input v-model="roomForm" placeholder="room id" v-on:keyup.enter="joinRoom">
          <template #append>
            <el-button @click="joinRoom">join</el-button>
          </template>
        </el-input>
      </div>
    </el-col>
  </el-row>
</template>
