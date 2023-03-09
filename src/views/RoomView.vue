<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRoomStore } from '@/stores/room'
import { watch , computed } from 'vue'
import { storeToRefs } from 'pinia'
import GameCard from '@/components/GameCard.vue'
import { RefreshLeft , View , Hide} from '@element-plus/icons-vue'

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
const showHide = computed({
  get() { return room.value.cardVisible },
  set(newValue:boolean) { 
    if(newValue) {
      show()
    } else {
      hide()
    }
  }
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-row justify="end">
          <el-link class="icon-button" :underline="false"  @click="() => showHide = !showHide" >
            <el-icon  size="20">
              <el-tooltip
              v-if="!showHide" 
                  class="box-item"
                  effect="dark"
                  content="Show"
                  placement="top-start"
                >
                <View />
              </el-tooltip>
                <el-tooltip  v-else
                  class="box-item"
                  effect="dark"
                  content="Hide"
                  placement="top-start"
                >
              <Hide />
              </el-tooltip>              
            </el-icon>
          </el-link>
          <el-link class="icon-button" :underline="false"  @click="() => reset()" >
            <el-icon  size="20"><RefreshLeft /></el-icon>
          </el-link>
        </el-row>
        <el-row justify="center" :gutter="15" class="user-view">
          <el-col :span="4" v-for="(user, index) in users" :key="index">
              <GameCard :card-value="user.card" :class="{ set : user.card }" />
            {{ user.name }}
          </el-col>
        </el-row>
      </el-main>
    </el-container>

  </div>
      <el-footer>
        <el-row justify="center">
          <el-col :span="3" v-for="val in ['1', '2', '3', '5', '8', '13', '21', '☕']" :key="val">
            <GameCard
              :card-value="val"
              @click="() => selectedCard === val? () => {} : vote(val)"
              :class="{ selected: selectedCard === val }"
            />
          </el-col>
        </el-row>
      </el-footer>
</template>

<style scoped>
.icon-button {
  padding: 0px 6px;

}
.el-container {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.el-main {
  padding-top: 2px;
}
.selected {
  opacity: 0;
  transform: translate(0, 0);
  animation-name: moveCard;
  animation-duration: 1s;
}
@keyframes moveCard {
  0%   {opacity: 1; transform: translate(0, 0);}
  100% {opacity: 0; transform: translate(0, -100px);}
}

@keyframes cardSet {
  0% {opacity: 0; transform: translate(0, 100px);}
  100%   {opacity: 1; transform: translate(0, 0);}
}
.set {
  opacity: 1;
  transform: translate(0, 0);
  animation-name: cardSet;
  animation-duration: 1s;
}
.user-view {
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}
.el-footer {
  position: absolute; 
  bottom: 0;
  left: 0;
  right: 0;
  height: auto;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  z-index: 1;
}
</style>
