<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRoomStore } from '@/stores/room'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import GameCard from '@/components/GameCard.vue'

const props = defineProps<{
  roomId: string
}>()

const userStore = useUserStore()
const roomStore = useRoomStore()
const { room, users, selectedCard } = storeToRefs(roomStore)
const { user } = storeToRefs(userStore)
const { joinRoom, vote, show, hide, reset } = roomStore

console.log(props.roomId, room.value.id)
if (props.roomId != room.value.id) {
  if (userStore.user.name) {
    joinRoom(props.roomId)
  }
  watch(
    () => user.value.name,
    (newUser) => {
      console.log(newUser)
      if (newUser !== '') {
        joinRoom(props.roomId)
      }
    }
  )
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-row justify="center">
          <el-button @click="() => show()">show</el-button>
          <el-button @click="() => hide()">hide</el-button>
          <el-button @click="() => reset()">reset</el-button>
        </el-row>
        <el-row justify="center" :gutter="15" class="user-view">
          <el-col :span="4" v-for="(user, index) in users" :key="index">
            <transition name="el-zoom-in-center">
              <GameCard :card-value="user.card" />
            </transition>
            {{ user.name }}
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <el-row justify="center">
          <el-col :span="3">
          <GameCard
            card-value="1"
            @click="() => vote('1')"
            :class="{ selected: selectedCard === '1' }"
          />
        </el-col><el-col :span="3">
          <GameCard
            card-value="2"
            @click="() => vote('2')"
            :class="{ selected: selectedCard === '2' }"
          />
        </el-col><el-col :span="3">
          <GameCard
            card-value="3"
            @click="() => vote('3')"
            :class="{ selected: selectedCard === '3' }"
          />
        </el-col><el-col :span="3">
          <GameCard
            card-value="5"
            @click="() => vote('5')"
            :class="{ selected: selectedCard === '5' }"
          />
        </el-col><el-col :span="3">
          <GameCard
            card-value="8"
            @click="() => vote('8')"
            :class="{ selected: selectedCard === '8' }"
          />
        </el-col><el-col :span="3">
          <GameCard
            card-value="13"
            @click="() => vote('13')"
            :class="{ selected: selectedCard === '13' }"
          />
        </el-col><el-col :span="3">
          <GameCard
            card-value="21"
            @click="() => vote('21')"
            :class="{ selected: selectedCard === '21' }"
          />
        </el-col><el-col :span="3">
          <GameCard
            card-value="C"
            @click="() => vote('C')"
            :class="{ selected: selectedCard === 'C' }"
          />
        </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.el-container {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.selected {
  background-color: yellow;
}
.user-view {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
