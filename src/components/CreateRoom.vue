<script setup lang="ts">
import type { SavedRoom } from '@/data-model'
import { useRoomStore } from '@/stores'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Delete } from '@element-plus/icons-vue'
const { t } = useI18n({ useScope: 'global' })

const roomStore = useRoomStore()
const roomForm = ref(localStorage.getItem('roomId') || '')

let callback = (list: SavedRoom[]) => {}

function joinRoom() {
  roomStore.joinRoom(roomForm.value)
}

function create() {
  roomStore.createRoom()
}

function querySearch(queryString: string, cb: any) {
  callback = cb
  // call callback function to return suggestions
  cb(roomStore.savedRooms)
}
function remove(item: SavedRoom) {
  roomStore.removeSavedRoom(item)
  callback(roomStore.savedRooms)
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
        <el-autocomplete v-model="roomForm" placeholder="room id" v-on:keyup.enter="joinRoom" :fetch-suggestions="querySearch" clearable 
        value-key="roomId" :debounce="1">
          <template #append>
            <el-button @click="joinRoom">{{ t('buttons.join-room') }}</el-button>
          </template>
          <template  #default="{ item }">
            <div class="item"><div>{{ item.roomId }}</div> <el-icon @click.stop="remove(item)"><Delete /></el-icon></div>
          </template>
        </el-autocomplete>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item .el-icon{
  padding: 5px
}
.item .el-icon:hover{
  color: red
}
.el-row { 
  max-width: 1000px;
  margin: 0 auto;
}
</style>
