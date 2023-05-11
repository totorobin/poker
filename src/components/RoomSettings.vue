<script setup lang="ts">
import { useRoomStore } from '@/stores'
import { Setting } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

const dialogFormVisible = ref(false)

const roomStore = useRoomStore()

const cards = ref('')
const selectedCards = computed(() => cards.value.split(';'))
const actionsOwnerOnly = ref(false)

const openDialog = () => {

  cards.value = roomStore.room?.cards?.join(';')
  currentList.value = selectedCards.value
  dialogFormVisible.value = true
  actionsOwnerOnly.value = roomStore.room?.actionsOwnerOnly
}
const updateSettings = () => {
  roomStore.updateSettings({
    roomId: roomStore.room.id,
    cards: selectedCards.value.map(a => a.trim()).filter(a => a.length > 0),
    owner: roomStore.room.owner,
    actionsOwnerOnly: actionsOwnerOnly.value
  })
  dialogFormVisible.value = false
}
const currentList = ref<string[]>([])
const cardsSets = [
  { id: "f", name: "Fibonacci", values: "0,5;1;2;3;5;8;13;21;30;50;100;∞;?;☕" },
  { id: "l", name: "lineraire", values: "0;1;2;3;4;5;6;7;8;9;10" },
  { id: "f2", name: "Fibonacci 2", values: "0;1;2;3;5;8;13;21;34;55;89;144" },
  { id: "t", name: "taille de tee-shirt", values: "xs;s;m;l;xl;?;☕" },
  { id: "w", name: "météo", values: "☀;🌤;🌥;🌦;🌧;⛈;🌨" }
]

const selectList = () => {
  cards.value = currentList.value.join(';')
}
const selectCard = (val: string) => {
  if (selectedCards.value.includes(val)) {
    cards.value = [...selectedCards.value.filter(v => v !== val)].join(';')
  } else {
    const desorderedList = [...selectedCards.value, val]
    cards.value = currentList.value.filter((v: string) => desorderedList.includes(v)).join(';')
  }
}
</script>

<template>
  <el-button link  v-if="roomStore.userUuid === roomStore.room.owner" class="icon-button" :underline="false" @click="openDialog">
    <el-icon size="25">
      <Setting />
    </el-icon>
  </el-button>

  <el-dialog v-model="dialogFormVisible" title="Settings">
    <el-row>
      <el-col :span="5">deck de cartes</el-col>
      <el-col :span="6">
        <select @change="selectList" v-model="currentList">
          <option :value="[]" disabled selected></option>
          <option v-for="(set, index) in cardsSets" :key="index" :value="set.values.split(';')">{{ set.name }}</option>
        </select>
      </el-col>
    </el-row>

    <div v-if="currentList.length != 0">
      <el-row class="list">
        <el-col :span="2" v-for="val in currentList" :key="val">
          <GameCard :card-value="val" @click="selectCard(val)" :class="{ cardSelected: selectedCards.includes(val) }" />
        </el-col>
      </el-row>
    </div>
    <el-input v-model="cards" placeholder="list of cards" />
    <p>
      Actions fors admin only <el-switch v-model="actionsOwnerOnly" />
    </p>

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

<style scoped>
.list {
  font-size: medium;
  padding-left: 10px;
}

.card {
  opacity: 0.5;
  transition: 1s ease;
}

.cardSelected {
  opacity: 1;
  transition: 1s ease;
}</style>