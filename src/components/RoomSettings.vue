<script setup lang="ts">
import { useRoomStore } from '@/stores';
import { Setting } from '@element-plus/icons-vue'
import {  ref } from 'vue';

const dialogFormVisible = ref(false)

const roomStore = useRoomStore()

const cards = ref('')
const openDialog = () => {
  cards.value = roomStore.room?.cards?.join(';')
  dialogFormVisible.value = true
}

const updateSettings = () => {
    roomStore.updateSettings({
        roomId : roomStore.room.id,
        cards : cards.value.split(';'),
        owner: roomStore.room.owner,
        actionsOwnerOnly: false
    })
    dialogFormVisible.value = false
}


const links = [
    "1;2;3;4;5;6;7;8;9;10",
    "1;2;3;5;8;13;21;☕",
    "0,5;1;2;3;5;8;13;20;30;50;100;∞;☕"
]
</script>

<template>
    <div v-if="roomStore.userUuid === roomStore.room.owner" class="icon-button" :underline="false" @click="openDialog">
        <el-icon size="25"><Setting /></el-icon>
    </div>
    
    <el-dialog v-model="dialogFormVisible" title="Settings">
        <el-input v-model="cards" placeholder="list of cards" />
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="updateSettings">
                Confirm
                </el-button>
            </span>
        </template>
  </el-dialog>
</template>

<style>
.my-autocomplete  {
    z-index: 999999999;
}
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete li .highlighted .addr {
  color: #ddd;
}
</style>