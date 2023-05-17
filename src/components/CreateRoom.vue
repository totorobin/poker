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
  <!--
 
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
  
-->

   <el-row class="room_box">
    <div class="room">
      <el-button @click="create" class="create">{{ t('buttons.new-room') }}</el-button>
      <div class="line"></div>
      <div class="text_input_room_name">
        <input type="text" v-model="roomForm" class="room_text" id="room_text" :placeholder="$t('titles.room-name')" />
      </div>
      <div class="line"></div>
      <el-button @click="joinRoom" class="join">{{ t('buttons.join-room') }}</el-button>
    </div>
 </el-row>
</template>

<style scoped>
.el-row {
  max-width: 1000px;
  margin: 0 auto;
}

.room_box {
  padding-top: 200px;
}

.room {
  padding-left: 0px;
  display: flex;
  align-items: center;
  margin: auto;
  max-width: 680px;
  max-height: 54px;
  background-color: white;
  border: 1px solid #e4e4e4;
  border-radius: 25px;
  -webkit-box-shadow: 0px 10px 38px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 10px 38px 0px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 10px 38px 0px rgba(0, 0, 0, 0.1);
}

.create {
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  line-height: 24px;
  font-weight: medium;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  height: 54px;
  border: none;
  padding-left: 40px;
  padding-right: 40px;
}

.join {
  display: flex;
  align-items: center;
  line-height: 24px;
  font-weight: medium;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  height: 54px;
  border: none;
  padding-left: 40px;
  padding-right: 40px;
}

.text {
  padding-left: 15px;
}

.line {
  margin-left: 1px;
  border-left: 1px solid #d8d8d8;
  height: 40px;
}

.room_text {
  width: 100%;
  border: none;
  margin-left: 15px;
  font-size: 16px;
  color: var(--el-text-color-regular);
  line-height: 24px;
  font-weight: Regular;
}

::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: #adb1b8;
}

.text_input_room_name {
  width:  450px;
  display: flex;
  align-items: center;
}

@media (max-width: 650px) {
  .text_input_room_name {
   width:  200px;
  }
}


.room_text:focus {
  outline: none !important;
}
</style>
