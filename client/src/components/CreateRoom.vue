<script setup lang="ts">
import { useRoomStore } from '../store/room.ts'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {type SavedRoom} from '../data-model.ts'
const { t } = useI18n({ useScope: 'global' })

const roomStore = useRoomStore()
const roomForm = ref(localStorage.getItem('roomId') || '')
const rooms : SavedRoom[] = JSON.parse(localStorage.getItem('rooms') || '[]')
console.log(rooms)
function joinRoom() {
  roomStore.joinRoom(roomForm.value)
}

function create() {
  roomStore.createRoom()
}

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
      ? rooms.filter(createFilter(queryString))
      : rooms
  // call callback function to return suggestions
  cb(results.map(r => ({value: r.roomId, room: r})))

}
const createFilter =  (queryString: string) => {
  return (room: SavedRoom) => {
    return (
        room.roomId.toLowerCase().indexOf(queryString.toLowerCase()) > 0
    )
  }
}

const handleSelect = (item: SavedRoom) => {
  console.log(item)
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
        <el-autocomplete v-model="roomForm" placeholder="room id"
                         :fetch-suggestions="querySearch"
                         @select="handleSelect"
                         v-on:keyup.enter="joinRoom">
          <template #append>
            <el-button @click="joinRoom">{{ t('buttons.join-room') }}</el-button>
          </template>
          <template #default="{ item }">
            <div  class="items" >
              <span>{{ item.value }}</span>
              <span class="cards">
                <span class="card" v-for="card in item.room.cards" >{{ card }}</span>
              </span>
            </div>


          </template>
        </el-autocomplete>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-row { 
  max-width: 1000px;
  margin: 0 auto;
}
.items {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  width: 10px;
  height: 15px;
  font-size: x-small;
  border-radius: 3px;
  border: 1px solid lightgray;
  margin: 2px;
}
</style>
